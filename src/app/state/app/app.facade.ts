import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { AppState } from "./app.state";
import { SetBuildNumber } from "./actions/set-build-number.action";
import { SetAddress } from "./actions/set-address.action";

@Injectable()
export class AppStateFacade {

    @Select(AppState.address)
    address$: Observable<string>;

    @Select(AppState.buildNumber)
    buildNumber$: Observable<number>;

    constructor(
        private store: Store
    ) {}

    setBuildNumber(buildNumber: number): Observable<void> {
        return this.store.dispatch(new SetBuildNumber(buildNumber));
    }

    setAddress(address: string): Observable<void> {
        return this.store.dispatch(new SetAddress(address));
    }
}
