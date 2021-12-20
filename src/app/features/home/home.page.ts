import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { IBscTransaction } from "src/app/interfaces/bsc-transaction.interface";
import { BscScanProvider } from "src/app/providers/bscScan/bscScanProvider";
import { AppStateFacade } from "src/app/state/app/app.facade";
import { BaseComponent } from "../base-component/base-component";

@Component({
	templateUrl: "main.page.html",
	styleUrls: ["main.page.scss"]
})
export class MainPageComponent extends BaseComponent {

	address$ = this.appStateFacade.address$;
	accountBalance: string;
	totalReflections: string;
	transactions: IBscTransaction[];
	loading: boolean;
	simpPrice: string;
	simpBnbPrice: string;
	simpDollarPrice: any;
	simpBnbPriceCalculated: any;
	simpReflectionsDollarPrice: any;
	simpReflectionsBnbPrice: any;

	constructor(
		private bscScanProvider: BscScanProvider,
		private toastrService: ToastrService,
		private appStateFacade: AppStateFacade
	) {
		super();
		this.getSimpPrice();
	}

	async getSimpPrice(): Promise<void> {
		const result = (await this.bscScanProvider.getSimpPrice()).data;
		console.log("getSimpPrice:", result);
		this.simpPrice = result.price.substring(0, 10);
		this.simpBnbPrice = result.price_BNB;
		// this.bnbPrice = reuslt
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
							console.log("transaction:", transaction);
							console.log("transaction value:", parseInt(transaction.value));
							totalSimpBought += parseInt(transaction.value);
						}
						console.log("balance:", parseInt(balance.result));
						console.log("totalSimpBought:", totalSimpBought);
						this.totalReflections = (parseInt(balance.result) - totalSimpBought).toString();
						console.log("this.totalReflections:", this.totalReflections);
						this.calculateReflectionsDollarPrice();
						this.calculateReflectionsBnbPrice();
	
						for (const transaction of this.transactions) {
							const txDetails = await this.bscScanProvider.getTransactionDetails(transaction.hash);
							console.log("txDetails.value:", txDetails.value);
							const value = txDetails.value.substring(0,1) + "." + txDetails.value.substring(1, 5);
							console.log("value:", value);
							transaction.bnbAmount = value;
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

