import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { IBscTransactionResult } from "src/app/interfaces/bsc-transactions-call.interface";
import { environment } from "src/environments/environment";
import Web3 from "web3";

@Injectable()
export class CoinGeckoProvider {

    constructor(
        private http: HttpClient
    ) {

    }

    async getSimpDetails(): Promise<any> {
        return firstValueFrom(this.http.get<any>(
            "https://api.coingecko.com/api/v3/coins/simp-token"
        ));
    }
}
