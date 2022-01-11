import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import Web3 from "web3";

@Injectable()
export class Web3Provider {

    constructor(
    ) {
    // placeholder
    }

    async getTransactionDetails(txHash: string): Promise<any> {
        const web3 = new Web3("https://bsc-dataseed1.binance.org:443");
        const result = await web3.eth.getTransactionReceipt(txHash);
        console.log("result:", result);
        return result;
    }

    async getAccountBalance(walletAddress: string):  Promise<any> {
        const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

        const tokenAddress = environment.simpContractAddress;

        const minABI = [
            // balanceOf
            {
                "constant":true,
                "inputs":[{"name":"_owner","type":"address"}],
                "name":"balanceOf",
                "outputs":[{"name":"balance","type":"uint256"}],
                "type":"function"
            },
            // decimals
            {
                "constant":true,
                "inputs":[],
                "name":"decimals",
                "outputs":[{"name":"","type":"uint8"}],
                "type":"function"
            }
        ] as any;

        const contract = new web3.eth.Contract(minABI,tokenAddress);

        const balance = {
            result: null,
            status: "0"
        }

        try {
            balance.result = await contract.methods.balanceOf(walletAddress).call();
            balance.status = "1";
        } catch (e) {
            balance.status = "0";
            balance.result = "Could not fet balance";
        }
        return balance;
    }
}
