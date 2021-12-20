import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetBuildNumber } from "./actions/set-build-number.action";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SetAddress } from "./actions/set-address.action";
import { IBnbPriceHistory } from "src/app/interfaces/bnb-price-history.interface";
import { AddBnbPriceHistory } from "./actions/add-bnb-price-history";

export interface IAppState {
    buildNumber: number;
    address: string;
    bnbPrices: IBnbPriceHistory[];
}

@State<IAppState>({
    name: "app",
    defaults: {
        buildNumber: 0,
        address: null,
        bnbPrices: []
    }
})
@Injectable()
export class AppState {

    @Selector()
    static buildNumber(state: IAppState): number {
        return state.buildNumber;
    }

    @Selector()
    static address(state: IAppState): string {
        return state.address;
    }

    @Selector()
    static bnbPriceHistory(state: IAppState): IBnbPriceHistory[] {
        return state.bnbPrices;
    }

    constructor(
        private http: HttpClient,
    ) {}

    @Action(SetBuildNumber)
    setBuildNumber(ctx: StateContext<IAppState>, payload: SetBuildNumber): void {
        ctx.patchState({
            buildNumber: payload.buildNumber
        });
    }

    @Action(SetAddress)
    setAddress(ctx: StateContext<IAppState>, payload: SetAddress): void {
        ctx.patchState({
            address: payload.address
        });
    }

    @Action(AddBnbPriceHistory)
    addBnbPriceHistory(ctx: StateContext<IAppState>, payload: AddBnbPriceHistory): void {
        const foundBnbPriceHistory = ctx.getState().bnbPrices.find(x => x.transactionTimestamp === payload.bnbPriceHistory.transactionTimestamp);
        if (foundBnbPriceHistory) {
            console.log("Already found bnb price action for:", payload.bnbPriceHistory);
        } else {
            ctx.patchState({
                bnbPrices: [...ctx.getState().bnbPrices, payload.bnbPriceHistory]
            });
        }

    }
}
