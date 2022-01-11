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
            `${baseUrl}?module=account&action=${action}&contractaddress=${environment.simpContractAddress}&address=${address}&tag=latest`
        ));
    }

    async getSimpTransactions(address: string): Promise<IBscTransactionResult> {
        console.log("getSimpTransactions:", address);
        const action = "tokentx";
        const baseUrl = "https://api.bscscan.com/api";
        return firstValueFrom(this.http.get<IBscTransactionResult>(
            `${baseUrl}?module=account&action=${action}&contractaddress=${environment.simpContractAddress}&address=${address}&sort=desc`
        //`${baseUrl}?module=account&action=${action}&contractaddress=${environment.simpContractAddress}&address=${address}&page=1&offset=200&startblock=0&endblock=999999999&sort=desc`
        ));
    }
}
