import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { firstValueFrom } from "rxjs";
import { IBscTransaction } from "src/app/interfaces/bsc-transaction.interface";
import { BinanceProvider } from "src/app/providers/binance/binanceProvider";
import { BscScanProvider } from "src/app/providers/bscScan/bscScanProvider";
import { AppStateFacade } from "src/app/state/app/app.facade";
import Web3 from "web3";
import { BaseComponent } from "../base-component/base-component";
import { Location } from "@angular/common";
import { socialBackgroundBase64 } from "./socialBackgroundBase64";

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
	simpDollarBalance: string;
	simpBnbPriceCalculated: string;
	simpReflectionsDollarPrice: string;
	simpReflectionsBnbPrice: string;
	percentageProfit: number;
	PNLDollar: number;
	socialShareImage = null;

	show = false;
	showNoSimpBalance = false;
	showUSD = true;

	constructor(
		private bscScanProvider: BscScanProvider,
		private toastrService: ToastrService,
		private appStateFacade: AppStateFacade,
		private binanceProvider: BinanceProvider,
		private router: ActivatedRoute,
		private location: Location
	) {
		super();
		this.getSimpPrice();

		this.router.params.subscribe((params) => {
			console.log("params:", params);
			const address = params.address;
			if (address) {
				this.appStateFacade.setAddress(address);
				this.retrieveSimpInformation(address);
			} else {
				this.checkAddress();
			}
		});
	}

	shareSocial(type: string): void {
		console.log("shareSocial:", type);

		const canvas = <HTMLCanvasElement>document.getElementById("socialCanvas");
		canvas.height = 1249;
		canvas.width = 900;
		const context = canvas.getContext("2d");
		const base_image = new Image();
		base_image.src = socialBackgroundBase64;
		base_image.onload = () => {
			// Step 1: Set the background image
			context.drawImage(base_image, 0, 0);
			context.textAlign = "center";

			// Step 2: Set the text
			// Step 2a: PROFIT
			if(type === "profit") {
				// title
				context.font = "bolder 70px Arial";
				context.fillStyle = "#FFFFFF"
				context.fillText("ROI", 450, 700);

				// Amount
				context.font = "bold 100px Arial";
				const profitColor = "#2aaa5f";
				const lossColor = "#FF4444";
				context.fillStyle = this.percentageProfit > 0 ? profitColor : lossColor;
				const roiSymbol = this.percentageProfit > 0 ? "+" : "";
				if (this.percentageProfit > 0) {
					context.fillText(`${roiSymbol}${this.percentageProfit.toFixed(2)}%`, 450, 800);
				} else {
					context.fillText(`${roiSymbol}${this.percentageProfit.toFixed(2)}%`, 450, 800);
				}
			} else {
				// Step 2b: Reflections
				// title
				context.font = "bolder 70px Arial";
				context.fillStyle = "#FFFFFF"
				context.fillText("I EARNED", 450, 600);

				// Reflections
				context.font = "bold 100px Arial";
				context.fillStyle = "#2aaa5f";
				const reflections = (parseInt(this.totalReflections) / 1000000 * parseFloat(this.simpPrice)).toLocaleString("en-US", { maximumFractionDigits: 2});
				context.fillText(`$ ${reflections}`, 450, 700);

				// subtitle
				context.font = "bolder 50px Arial";
				context.fillStyle = "#FFFFFF"
				context.fillText("BY HODL SIMP", 450, 770);

				// context.font = "bolder 60px Arial";
				// context.fillStyle = "#FFFFFF"
				// context.fillText("REFLECTIONS EARNED!", 450, 800);
			}


			// Step 3: Set the price text
			context.font = "bold 40px Arial";
			context.fillStyle = "#39E5FD";
			context.fillText(`$ ${parseFloat(this.simpPrice).toFixed(10)}`, 225, 1050);

			// Step 4: Set the marketcap text
			context.font = "bold 40px Arial";
			context.fillStyle = "#FF3654";
			context.fillText(`$ ${this.marketcap.toLocaleString("en-US", { maximumFractionDigits: 0})}`, 675, 1050);

			// Step 5: Export the image as base64
			this.socialShareImage = canvas.toDataURL();
		}
	}

	clearSocialImage(): void {
		this.socialShareImage = null;
	}

	async shareImage(): Promise<void> {
		if (this.canShare()) {
			const blob = await (await fetch(this.socialShareImage)).blob();
			const file = new File([blob], "watchmesimp.jpg", { type: blob.type });
			const shareData = {
				title: "Watch me SIMP",
				text: "I am going to the moon with SIMP!",
				files: [file]
			}

			try {
				await navigator.share(shareData);
				this.socialShareImage = null;
			} catch (err) {
				console.error(err);
			}
		} else {
			console.log("Sharing not supported...");
		}
	}

	async downloadImage(): Promise<void> {
		const a = document.createElement("a");
		a.href = this.socialShareImage
		a.download = "watchmesimp.jpg";
		a.click();
	}

	canShare(): boolean {
		return !!navigator.share;
	}

	async checkAddress(): Promise<void> {
		const address = await firstValueFrom(this.appStateFacade.address$);
		console.log("address:", address);
		if (address) {
			this.retrieveSimpInformation(address);
		}
	}

	async getWBNBFromTransactionReceipt(transaction: any): Promise<string> {
		const wBnbConctractAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
		const hexValueWBNB = transaction.logs.find(x => x.address === wBnbConctractAddress);
		console.log("hexValueWBNB:", hexValueWBNB);
		let WBNB = "0";
		if (hexValueWBNB) {
			WBNB = Web3.utils.hexToNumberString(hexValueWBNB.data);
		}
		console.log("WBNB:", WBNB);
		return WBNB;
	}

	async getSimpPrice(): Promise<void> {
		const result = (await this.bscScanProvider.getSimpPrice()).data;
		console.log("getSimpPrice:", result);
		this.simpPrice = result.price;
		this.simpBnbPrice = result.price_BNB;
		this.marketcap = parseFloat(this.simpPrice) * this.circulationSupply;
	}

	calculateDollarPrice(): void {
		console.log("this.accountBalance:", this.accountBalance);
		console.log("this.simpPrice:", this.simpPrice);
		this.simpDollarBalance = ((parseFloat(this.accountBalance) / 1000000) * parseFloat(this.simpPrice)).toFixed(2);
		console.log("this.simpDollarBalance:", this.simpDollarBalance);
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
		if (address !== null) {
			this.location.replaceState("/" + address);
		}
		console.log("retrieveSimpInformation address:", address);
		this.show = true;
		this.transactions = null;
		this.simpDollarBalance = null;
		this.accountBalance = null;
		this.totalReflections = null;
		this.percentageProfit = null;
		this.PNLDollar = null;
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
						if (parseFloat(this.simpDollarBalance) === 0) {
							console.log("NO simp balance!");
							this.showNoSimpBalance = true;
							this.loading = false;
							return;
						} else {
							this.showNoSimpBalance = false;
						}
						this.calculateSimpBnb();
						this.transactions = (await this.bscScanProvider.getSimpTransactions(address)).result;


						const bnbPriceHistory = await firstValueFrom(this.appStateFacade.bnbPriceHistory$);
						console.log("bnbPriceHistory:", bnbPriceHistory);
						let totalSimpBought = 0;
						let totalIn = 0;
						let totalOut = parseFloat(this.simpDollarBalance);
						for (const transaction of this.transactions) {
							const bought = transaction.to.toLowerCase() === address.toLowerCase();
							transaction.bought = bought;
							transaction.transferIn = null;
							console.log("bought:", bought);
							console.log("transaction:", transaction);
							console.log("transaction value:", parseInt(transaction.value));

							if (bought) {
								totalSimpBought = totalSimpBought + parseInt(transaction.value); //BBought or transfer in
								console.log("parseInt(transaction.value):", parseInt(transaction.value));
								console.log("totalSimpBought:", totalSimpBought);
							} else {
								totalSimpBought = totalSimpBought - (parseInt(transaction.value) / 0.915); // Sold or transfer out
								console.log("parseInt(transaction.value):", parseInt(transaction.value));
								console.log("totalSimpBought:", totalSimpBought);
							}

							const transactionReceipt = await this.bscScanProvider.getTransactionDetails(transaction.hash);
							console.log("transactionReceipt:", transactionReceipt);
							const wBnb = await this.getWBNBFromTransactionReceipt(transactionReceipt);
							if (wBnb !== "0") {
								transaction.bnbAmount = Web3.utils.fromWei(wBnb, "ether");
							} else if (wBnb === "0" && bought) {
								console.log("transfer in");
								transaction.transferIn = true;
							} else if (wBnb === "0" && !bought) {
								console.log("transfer out");
								transaction.transferIn = false;
							}


							const foundBnbPrice = bnbPriceHistory.find(x => x.transactionTimestamp === transaction.timeStamp);
							// If we already retrieved the information from binance
							if (foundBnbPrice) {
								console.log("Found BNB price:", foundBnbPrice);
								transaction.bnbPrice = foundBnbPrice.price;
								// We dont have BNB price yet, add it
							} else {
								const unixTimestamp = (parseInt(transaction.timeStamp) * 1000);
								console.log("date:", unixTimestamp);
								console.log("unixTimestamp:", unixTimestamp);
								const date = new Date(unixTimestamp);
								date.setSeconds(0);
								console.log("date:", date);
								const bnbPrice = parseFloat(await this.binanceProvider.getBNBPriceOnDate(date.getTime()));
								console.log("bnbPrice:", bnbPrice);
								await this.promiseWait(100);
								transaction.bnbPrice = bnbPrice;
								this.appStateFacade.addToBnbPrices({
									price: bnbPrice,
									transactionTimestamp: transaction.timeStamp
								})
							}

							console.log("transaction.bnbPrice:", transaction.bnbPrice);
							const dollarSpend = transaction.bnbAmount ? parseFloat(transaction.bnbAmount) * transaction.bnbPrice : 0;
							if (bought) {
								console.log("dollarSpend:", dollarSpend);
								totalIn += dollarSpend;
							} else {
								console.log("dollarSpend:", dollarSpend);
								totalOut += dollarSpend;
							}
						}
						console.log("totalOut:", totalOut);
						console.log("totalIn:", totalIn);
						const percentageProfit = ((totalOut - totalIn) / totalIn) * 100;
						// const moneySpend = totalIn - (totalOut - parseFloat(this.simpDollarBalance));
						const PNLDollar = totalOut - totalIn;
						console.log("PNLDollar:", PNLDollar);
						this.PNLDollar = PNLDollar;
						this.percentageProfit = percentageProfit;
						console.log("percentageProfit:", percentageProfit);
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

	promiseWait(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	buySimpPancake(): void {
		window.open("https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0xd0accf05878cafe24ff8b3f82f194c62ed755707");
	}
}
