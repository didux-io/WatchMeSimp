import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { IBscTransaction } from "src/app/interfaces/bsc-transaction.interface";
import { BscScanProvider } from "src/app/providers/bscScan/bscScanProvider";
import { AppStateFacade } from "src/app/state/app/app.facade";
import Web3 from "web3";
import { BaseComponent } from "../base-component/base-component";

@Component({
	templateUrl: "home.page.html",
	styleUrls: ["home.page.scss"]
})
export class HomePageComponent extends BaseComponent {

	address$ = this.appStateFacade.address$;
	accountBalance: string;
	totalReflections: string;
	transactions: IBscTransaction[];
	loading: boolean;
	simpPrice: string;
	circulationSupply = 507116781500;
	marketcap = 0;
	simpBnbPrice: string;
	simpDollarPrice: any;
	simpBnbPriceCalculated: any;
	simpReflectionsDollarPrice: any;
	simpReflectionsBnbPrice: any;

	show = false;

	constructor(
		private bscScanProvider: BscScanProvider,
		private toastrService: ToastrService,
		private appStateFacade: AppStateFacade
	) {
		super();
		this.getSimpPrice();
	}

	async getWBNBFromTransactionReceipt(transaction: any): Promise<string> {
		const wBnbConctractAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
		const hexValueWBNB = transaction.logs.find(x => x.address === wBnbConctractAddress).data;
		console.log("hexValueWBNB:", hexValueWBNB);
		const WBNB = Web3.utils.hexToNumberString(hexValueWBNB);
		console.log("WBNB:", WBNB);
		return WBNB;
	}

	async getSimpPrice(): Promise<void> {
		const result = (await this.bscScanProvider.getSimpPrice()).data;
		console.log("getSimpPrice:", result);
		this.simpPrice = result.price.substring(0, 10);
		this.simpBnbPrice = result.price_BNB;
		this.marketcap = parseFloat(this.simpPrice) * this.circulationSupply;
	}

	calculateDollarPrice(): void {
		console.log("this.accountBalance:", this.accountBalance);
		console.log("this.simpPrice:", this.simpPrice);
		this.simpDollarPrice = ((parseFloat(this.accountBalance) / 1000000) * parseFloat(this.simpPrice)).toFixed(2);
		console.log("this.simpDollarPrice:", this.simpDollarPrice);
	}

	calculateSimpBnb(): void {
		console.log("calculateSimpBnb");
		console.log("this.accountBalance:", this.accountBalance);
		console.log("this.simpBnbPrice:", this.simpBnbPrice);
		this.simpBnbPriceCalculated = ((parseFloat(this.accountBalance) / 1000000) * parseFloat(this.simpBnbPrice)).toFixed(2);
		console.log("this.simpBnbPriceCalculated:", this.simpBnbPriceCalculated);
	}

	calculateReflectionsDollarPrice(): void {
		console.log("calculateReflectionsDollarPrice");
		console.log("this.totalReflections:", this.totalReflections);
		console.log("this.simpPrice:", this.simpPrice);
		this.simpReflectionsDollarPrice = ((parseFloat(this.totalReflections) / 1000000) * parseFloat(this.simpPrice)).toFixed(2);
		console.log("this.simpReflectionsDollarPrice:", this.simpReflectionsDollarPrice);
	}

	calculateReflectionsBnbPrice(): void {
		console.log("calculateReflectionsDollarPrice");
		console.log("this.totalReflections:", this.totalReflections);
		console.log("this.simpPrice:", this.simpPrice);
		this.simpReflectionsBnbPrice = ((parseFloat(this.totalReflections) / 1000000) * parseFloat(this.simpBnbPrice)).toFixed(2);
		console.log("this.simpReflectionsBnbPrice:", this.simpReflectionsBnbPrice);
	}

	async retrieveSimpInformation(address: string): Promise<void> {
		console.log("retrieveSimpInformation address:", address);
		this.show = true;
		try {
			this.loading = true;
			if (address.substring(0, 2) === "0x") {
				const balance = await this.bscScanProvider.getAccountBalance(address);
				if (balance.status === "0") {
					this.toastrService.error(balance.result);
				} else {
					setTimeout(async () => {
						this.appStateFacade.setAddress(address);
						console.log("balance:", balance);
						this.accountBalance = balance.result;
						this.calculateDollarPrice();
						this.calculateSimpBnb();
						this.transactions = (await this.bscScanProvider.getSimpTransactions(address)).result;
	
						let totalSimpBought = 0;
						for (const transaction of this.transactions) {
							const bought = transaction.to === address;
							transaction.bought = bought;
							console.log("bought:", bought);
							console.log("transaction:", transaction);
							console.log("transaction value:", parseInt(transaction.value));

							if (bought) {
								totalSimpBought = totalSimpBought + parseInt(transaction.value);
								console.log("parseInt(transaction.value):", parseInt(transaction.value));
								console.log("totalSimpBought:", totalSimpBought);
							} else {
								totalSimpBought = totalSimpBought - (parseInt(transaction.value) / 0.915);
								console.log("parseInt(transaction.value):", parseInt(transaction.value));
								console.log("totalSimpBought:", totalSimpBought);
							}
						}
						console.log("balance:", parseInt(balance.result));
						console.log("totalSimpBought:", totalSimpBought);
						this.totalReflections = (parseInt(balance.result) - totalSimpBought).toString();
						console.log("this.totalReflections:", this.totalReflections);
						this.calculateReflectionsDollarPrice();
						this.calculateReflectionsBnbPrice();
	
						for (const transaction of this.transactions) {
							const transactionReceipt = await this.bscScanProvider.getTransactionDetails(transaction.hash);
							console.log("transactionReceipt:", transactionReceipt);
							const wBnb = await this.getWBNBFromTransactionReceipt(transactionReceipt);
							transaction.bnbAmount = Web3.utils.fromWei(wBnb, "ether");
						}
						this.loading = false;
					}, 6000);
				}
			} else {
				this.toastrService.error("User address input not valid");
			}
		} catch (error) {
			console.error(error);
			this.loading = false;
		}
	}

	openTransactionLink(transaction: IBscTransaction): void {
		window.open(`https://bscscan.com/tx/${transaction.hash}`)
	}
}

