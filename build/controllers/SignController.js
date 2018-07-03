"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const class_validator_1 = require("class-validator");
const logService_1 = require("../services/logService");
const common_1 = require("../common");
// EOSJS has no typings, so use it as regular node.js module
const Eos = require("eosjs");
class SignTransactionRequest {
}
__decorate([
    class_validator_1.IsArray(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", Array)
], SignTransactionRequest.prototype, "privateKeys", void 0);
__decorate([
    class_validator_1.IsBase64(),
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SignTransactionRequest.prototype, "transactionContext", void 0);
class SignTransactionResponse {
    constructor(signedTransaction) {
        this.signedTransaction = signedTransaction;
    }
}
class TransactionContext {
}
let SignController = SignController_1 = class SignController {
    constructor(log) {
        this.log = log;
    }
    /**
     * Signs transaction with provided private keys or/and with hot wallet private key, if necessary.
     * @param request Private keys and data of transaction to sign.
     */
    async signTransaction(request) {
        // context actually is a disassembled transaction
        const ctx = common_1.fromBase64(request.transactionContext);
        if (ctx.actions.length == 0) {
            return new SignTransactionResponse(common_1.toBase64({
                txId: "0x"
            }));
        }
        // remove stubs of "virtual" deposit wallets keys
        const privateKeys = request.privateKeys.filter(k => !!k);
        // append hot wallet private key, if necessary
        if (ctx.actions.some(a => a.data.from == process.env.HotWalletAccount) && privateKeys.indexOf(process.env.HotWalletActivePrivateKey) < 0) {
            privateKeys.push(process.env.HotWalletActivePrivateKey);
        }
        // configure EOS to build and sign, but not broadcast transactions
        const eos = Eos.Localnet({
            chainId: ctx.chainId,
            transactionHeaders: (expireInSeconds, callback) => callback(null, ctx.headers),
            signProvider: (args) => privateKeys.map(k => args.sign(args.buf, k)),
        });
        // assembly the transaction - transactionHeaders() and
        // signProvider() from the config above will be called
        const signed = await eos.transaction(ctx, {
            broadcast: false
        });
        await this.log.write(logService_1.LogLevel.info, SignController_1.name, this.signTransaction.name, "Tx signed", signed.transaction_id);
        return new SignTransactionResponse(common_1.toBase64(signed.transaction));
    }
};
__decorate([
    routing_controllers_1.Post(),
    __param(0, routing_controllers_1.Body({ required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignTransactionRequest]),
    __metadata("design:returntype", Promise)
], SignController.prototype, "signTransaction", null);
SignController = SignController_1 = __decorate([
    routing_controllers_1.JsonController("/sign"),
    __metadata("design:paramtypes", [logService_1.LogService])
], SignController);
exports.SignController = SignController;
var SignController_1;
//# sourceMappingURL=signController.js.map