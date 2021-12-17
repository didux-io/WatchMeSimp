import { Action, Selector, State, StateContext } from "@ngxs/store";
import { SetBuildNumber } from "./actions/set-build-number.action";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SetAddress } from "./actions/set-address.action";

export interface IAppState {
    buildNumber: number;
    address: string;
}

@State<IAppState>({
    name: "app",
    defaults: {
        buildNumber: 0,
        address: null
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
}
