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
let SignController = class SignController {
    /**
     * Signs transaction with provided private keys or/and with hot wallet private key, if necessary.
     * @param request Private keys and data of transaction to sign.
     */
    async signTransaction(request) {
        // context actually is a disassembled transaction
        const ctx = common_1.fromBase64(request.transactionContext);
        // remove stubs of "virtual" deposit wallets keys
        const privateKeys = request.privateKeys.filter(k => !!k);
        // append hot wallet private key, if necessary
        if (ctx.actions.some(a => a.data.from == process.env.HotWalletAccount)) {
            privateKeys.push(process.env.HotWalletActivePrivateKey);
        }
        // configure EOS to build and sign, but not broadcast transactions
        const eos = Eos.Localnet({
            signProvider: (args) => privateKeys.map(k => args.sign(args.buf, k)),
            transactionHeaders: (expireInSeconds, callback) => callback(null, ctx.headers),
            broadcast: false
        });
        // assembly the transaction - transactionHeaders() and 
        // signProvider() from the config above will be called
        const data = await eos.transaction(ctx.actions);
        return new SignTransactionResponse(common_1.toBase64(data.transaction));
    }
};
__decorate([
    routing_controllers_1.Post(),
    __param(0, routing_controllers_1.Body({ required: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignTransactionRequest]),
    __metadata("design:returntype", Promise)
], SignController.prototype, "signTransaction", null);
SignController = __decorate([
    routing_controllers_1.JsonController("/sign")
], SignController);
exports.SignController = SignController;
//# sourceMappingURL=signController.js.map