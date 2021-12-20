import { IBnbPriceHistory } from "src/app/interfaces/bnb-price-history.interface";

export class AddBnbPriceHistory {
    static readonly type = "[App] AddBnbPriceHistory";

    constructor(public bnbPriceHistory: IBnbPriceHistory) {}
}
