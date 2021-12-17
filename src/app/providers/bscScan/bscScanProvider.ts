import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { IBscTransactionResult } from "src/app/interfaces/bsc-transactions-call.interface";
import { environment } from "src/environments/environment";
import Web3 from "web3";

@Injectable()
export class BscScanProvider {

    constructor(
        private http: HttpClient
    ) {

    }

    async getAccountBalance(address: string): Promise<any> {
        const action = "tokenbalance";
        const baseUrl = "https://api.bscscan.com/api";
        return firstValueFrom(this.http.get<any>(
            `${baseUrl}?module=account&action=${action}&contractaddress=${environment.simpContractAddress}&address=${address}&tag=latest&apikey=${environment.bscScanApiKey}`
        ));
    }

    async getSimpTransactions(address: string): Promise<IBscTransactionResult> {
        console.log("getSimpTransactions:", address);
        const action = "tokentx";
        const baseUrl = "https://api.bscscan.com/api";
        return firstValueFrom(this.http.get<IBscTransactionResult>(
            `${baseUrl}?module=account&action=${action}&contractaddress=${environment.simpContractAddress}&address=${address}&page=1&offset=200&startblock=0&endblock=999999999&sort=desc&apikey=${environment.bscScanApiKey}`
        ));
    }

    async getTransactionDetails(txHash: string): Promise<any> {
        const web3 = new Web3("https://bsc-dataseed1.binance.org:443");
        const result = await web3.eth.getTransaction(txHash);
        console.log("result:", result);
        return result;
    }

    async getSimpPrice(): Promise<any> {
        return firstValueFrom(this.http.get<any>(
            `https://api.pancakeswap.info/api/v2/tokens/${environment.simpContractAddress}`
        ));
    }
}
