import { IBscTransaction } from "./bsc-transaction.interface";

export interface IBscTransactionResult {
    status: string;
    message: string;
    result: IBscTransaction[];
}