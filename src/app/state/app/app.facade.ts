import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { AppState } from "./app.state";
import { SetBuildNumber } from "./actions/set-build-number.action";
import { SetAddress } from "./actions/set-address.action";
import { IBnbPriceHistory } from "src/app/interfaces/bnb-price-history.interface";
import { AddBnbPriceHistory } from "./actions/add-bnb-price-history";

@Injectable()
export class AppStateFacade {

    @Select(AppState.address)
    address$: Observable<string>;

    @Select(AppState.buildNumber)
    buildNumber$: Observable<number>;

    @Select(AppState.bnbPriceHistory)
    bnbPriceHistory$: Observable<IBnbPriceHistory[]>;

    constructor(
        private store: Store
    ) {}

    setBuildNumber(buildNumber: number): Observable<void> {
        return this.store.dispatch(new SetBuildNumber(buildNumber));
    }

    setAddress(address: string): Observable<void> {
        return this.store.dispatch(new SetAddress(address));
    }

    addToBnbPrices(bnbPriceHistory: IBnbPriceHistory): Observable<void> {
        return this.store.dispatch(new AddBnbPriceHistory(bnbPriceHistory));
    }
}
