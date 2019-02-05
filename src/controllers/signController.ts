import { JsonController, Body, Post, BadRequestError } from "routing-controllers";
import { IsArray, IsString, IsNotEmpty, IsBase64 } from "class-validator";
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

    constructor(private settings: Settings) {
        ecc.initialize();
    }

    /**
     * Signs transaction with provided private keys or/and with hot wallet private key, if necessary.
     * @param request Private keys and data of transaction to sign.
     */
    @Post()
    async signTransaction(@Body({ required: true }) request: SignTransactionRequest): Promise<SignTransactionResponse> {

        // context actually is a disassembled transaction
        const ctx = fromBase64<TransactionContext>(request.transactionContext);

        // for real transactions real privite keys are required;
        // for simulated transactions (i.e. DW -> HW) we don't have any real action, 
        // but we protect such activities with HW private key
        if (!request.privateKeys.length ||
            !request.privateKeys.every(k => ecc.isValidPrivate(k)) || 
            (ctx.actions.length == 0 && request.privateKeys.some(k => ecc.PrivateKey.fromString(k).toPublic().toString() != this.settings.EosSignService.HotWalletActivePublicKey))) {
            throw new BadRequestError("Invalid private key(s)");
        }

        // for simulated transactions we will use operation ID as tx ID
        if (ctx.actions.length == 0) {
            return new SignTransactionResponse(toBase64({}));
        }

        // configure EOS to build and sign, but not broadcast transactions
        const eos = Eos({
            chainId: ctx.chainId,
            transactionHeaders: (expireInSeconds: number, callback: Function) => callback(null, ctx.headers),
            signProvider: (args: any) => request.privateKeys.map(k => args.sign(args.buf, k)),
            httpEndpoint: null
        });

        // assembly the transaction - transactionHeaders() and
        // signProvider() from the config above will be called
        const signed = await eos.transaction(ctx, {
            broadcast: false
        });

        return new SignTransactionResponse(toBase64(signed));
    }
}