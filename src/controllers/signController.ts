import { JsonController, Param, Body, Get, Post, Put, Delete, BadRequestError } from "routing-controllers";
import { IsArray, IsString, IsNotEmpty, IsBase64 } from "class-validator";
import { fromBase64, toBase64 } from "../common";
import util from "util";

// EOSJS has no typings, so use it as regular node.js module
const Eos = require("eosjs");

class SignTransactionRequest {

    @IsArray()
    @IsNotEmpty()
    privateKeys: string[];

    @IsBase64()
    @IsNotEmpty()
    @IsString()
    transactionContext: string;
}

class SignTransactionResponse {
    constructor(public signedTransaction: string) {
    }
}

class TransactionContext {
    headers: any[];
    actions: any[];
}

@JsonController("/sign")
export class SignController {
    /**
     * Signs transaction with provided private keys or/and with hot wallet private key, if necessary.
     * @param request Private keys and data of transaction to sign.
     */
    @Post()
    async signTransaction(@Body({ required: true }) request: SignTransactionRequest): Promise<SignTransactionResponse> {

        // context actually is a disassembled transaction
        const ctx = fromBase64<TransactionContext>(request.transactionContext);

        // remove stubs of "virtual" deposit wallets keys
        const privateKeys = request.privateKeys.filter(k => !!k);

        // append hot wallet private key, if necessary
        if (ctx.actions.some(a => a.data.from == process.env.HotWalletAccount)) {
            privateKeys.push(process.env.HotWalletActivePrivateKey);
        }

        // configure EOS to build and sign, but not broadcast transactions
        const eos = Eos.Localnet({
            signProvider: (args: any) => privateKeys.map(k => args.sign(args.buf, k)),
            transactionHeaders: (expireInSeconds: number, callback: Function) => callback(null, ctx.headers),
            broadcast: false
        });

        // assembly the transaction - transactionHeaders() and 
        // signProvider() from the config above will be called
        const data = await eos.transaction(ctx.actions);

        return new SignTransactionResponse(toBase64(data.transaction));
    }
}