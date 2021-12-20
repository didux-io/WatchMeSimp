import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { IBscTransactionResult } from "src/app/interfaces/bsc-transactions-call.interface";
import { environment } from "src/environments/environment";
import Web3 from "web3";
import moment from "moment";

@Injectable()
export class BinanceProvider {

    constructor(
        private http: HttpClient
    ) {

    }

    async getBNBPriceOnDate(dateTimeStamp: number): Promise<any> {
        console.log("dateTimeStamp", dateTimeStamp);
        const url = `https://api.binance.com/api/v3/klines?symbol=BNBUSDT&interval=1m&startTime=${dateTimeStamp}&endTime=${dateTimeStamp}`;
        console.log("url:", url);
        const result = await (firstValueFrom(this.http.get<any>(
            url
        )));
        console.log("result:", result);
        // First in the array and then the closing price (4)
        // https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
        return result[0][4];
    }
}
