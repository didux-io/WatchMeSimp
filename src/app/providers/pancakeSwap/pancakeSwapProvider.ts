import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class PancakeSwapProvider {

    constructor(
        private http: HttpClient
    ) {

    }

    async getSimpPrice(): Promise<any> {
        return firstValueFrom(this.http.get<any>(
            `https://api.pancakeswap.info/api/v2/tokens/${environment.simpContractAddress}`
        ));
    }
}
