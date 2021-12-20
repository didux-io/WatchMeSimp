import { Component } from "@angular/core";
import moment from "moment";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom, timer } from "rxjs";
import { IBscTransaction } from "src/app/interfaces/bsc-transaction.interface";
import { BinanceProvider } from "src/app/providers/binance/binanceProvider";
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
		private appStateFacade: AppStateFacade,
		private binanceProvider: BinanceProvider
	) {
		super();
		this.getSimpPrice();

		// this.binanceProvider.getBNBPriceOnDate(parseInt("1639999945000") / 1000, parseInt("1639999945000") / 1000).then(result =>{
		// 	console.log("HERE:", result);
		// });
		// const startDate = moment("2021-12-15").startOf("day");
		// console.log("startDate:", startDate.toString());
		// this.binanceProvider.getBNBPriceOnDate(new Date(startDate.toString()).getTime() / 1000).then(result =>{
		// 	console.log("HERE:", result);
		// });
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
					this.loading = false;
					this.show = false;
				} else {
					setTimeout(async () => {
						this.appStateFacade.setAddress(address);
						console.log("balance:", balance);
						this.accountBalance = balance.result;
						this.calculateDollarPrice();
						this.calculateSimpBnb();
						this.transactions = (await this.bscScanProvider.getSimpTransactions(address)).result;


						const bnbPriceHistory = await firstValueFrom(this.appStateFacade.bnbPriceHistory$);
						console.log("bnbPriceHistory:", bnbPriceHistory);
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

							const transactionReceipt = await this.bscScanProvider.getTransactionDetails(transaction.hash);
							console.log("transactionReceipt:", transactionReceipt);
							const wBnb = await this.getWBNBFromTransactionReceipt(transactionReceipt);
							transaction.bnbAmount = Web3.utils.fromWei(wBnb, "ether");

							const foundBnbPrice = bnbPriceHistory.find(x => x.transactionTimestamp === transaction.timeStamp);
							// If we already retrieved the information from binance
							if (foundBnbPrice) {
								console.log("Found BNB price:", foundBnbPrice);
								transaction.bnbPrice = foundBnbPrice.price;
							// We dont have BNB price yet, add it
							} else {
								const startOfDay = moment(new Date(parseInt(transaction.timeStamp) * 1000)).startOf("minute").toString();
								console.log("startOfDay:", startOfDay);
								const bnbPrice = await this.binanceProvider.getBNBPriceOnDate(new Date(startOfDay).getTime());
								console.log("bnbPrice:", bnbPrice);
								await this.promiseWait(1000);
								transaction.bnbPrice = bnbPrice;
								this.appStateFacade.addToBnbPrices({
									price: bnbPrice,
									transactionTimestamp: transaction.timeStamp
								})
							}
						}
						console.log("balance:", parseInt(balance.result));
						console.log("totalSimpBought:", totalSimpBought);
						this.totalReflections = (parseInt(balance.result) - totalSimpBought).toString();
						console.log("this.totalReflections:", this.totalReflections);
						this.calculateReflectionsDollarPrice();
						this.calculateReflectionsBnbPrice();

						this.loading = false;
					}, 6000);
				}
			} else {
				this.toastrService.error("User address input not valid");
				this.show = false;
				this.loading = false;
			}
		} catch (error) {
			console.error(error);
			this.loading = false;
			this.show = false;
		}
	}

	openTransactionLink(transaction: IBscTransaction): void {
		window.open(`https://bscscan.com/tx/${transaction.hash}`)
	}

	promiseWait(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

