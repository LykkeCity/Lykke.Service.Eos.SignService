import { JsonController, Body, Post, BadRequestError } from "routing-controllers";
import { IsArray, IsString, IsNotEmpty, IsBase64 } from "class-validator";
import { LogService, LogLevel } from "../services/logService";
import { fromBase64, toBase64, Settings } from "../common";

// EOSJS has no typings, so use it as regular node.js module
const Eos = require("eosjs");
const ecc = require("eosjs-ecc");

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
    chainId: string;
    headers: any[];
    actions: any[];
}

@JsonController("/sign")
export class SignController {

    constructor(private log: LogService, private settings: Settings) {
    }

    /**
     * Signs transaction with provided private keys or/and with hot wallet private key, if necessary.
     * @param request Private keys and data of transaction to sign.
     */
    @Post()
    async signTransaction(@Body({ required: true }) request: SignTransactionRequest): Promise<SignTransactionResponse> {

        // context actually is a disassembled transaction
        const ctx = fromBase64<TransactionContext>(request.transactionContext);

        // for simulated transactions (i.e. DW -> HW) we don't have any real action,
        // but we protect such activities with HW private key
        if (ctx.actions.length == 0) {
            if (request.privateKeys.some(k => ecc.PrivateKey.fromString(k).toPublic().toString() != this.settings.EosSignService.HotWalletActivePublicKey)) {
                throw new BadRequestError("Invalid private key(s)");
            }
            return new SignTransactionResponse(toBase64({
                txId: Date.now().toFixed()
            }));
        }

        // configure EOS to build and sign, but not broadcast transactions
        const eos = Eos.Localnet({
            chainId: ctx.chainId,
            transactionHeaders: (expireInSeconds: number, callback: Function) => callback(null, ctx.headers),
            signProvider: (args: any) => request.privateKeys.map(k => args.sign(args.buf, k)),
        });

        // assembly the transaction - transactionHeaders() and
        // signProvider() from the config above will be called
        const signed = await eos.transaction(ctx, {
            broadcast: false
        });

        await this.log.write(LogLevel.info, SignController.name, this.signTransaction.name, "Tx signed", signed.transaction_id);

        return new SignTransactionResponse(toBase64(signed.transaction));
    }
}