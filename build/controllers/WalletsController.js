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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const logService_1 = require("../services/logService");
const uuid_1 = __importDefault(require("uuid"));
let WalletsController = WalletsController_1 = class WalletsController {
    constructor(log) {
        this.log = log;
    }
    /**
     * Creates a kind of "virtual" wallet in format "{ HotWalletAccount }/{ UniqueId }" for using as deposit wallet.
     * While sending funds user must use { HotWalletAccount } as "to" and { UniqueId } as "memo" fields of cash-in transaction action.
     */
    createWallet() {
        const id = uuid_1.default.v4();
        this.log.write(logService_1.LogLevel.info, WalletsController_1.name, this.createWallet.name, "Wallet generated", id);
        return {
            publicAddress: `${process.env.hotWalletAccount}/${id}`
        };
    }
};
__decorate([
    routing_controllers_1.Post(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WalletsController.prototype, "createWallet", null);
WalletsController = WalletsController_1 = __decorate([
    routing_controllers_1.JsonController("/wallets"),
    __metadata("design:paramtypes", [logService_1.LogService])
], WalletsController);
exports.WalletsController = WalletsController;
var WalletsController_1;
//# sourceMappingURL=walletsController.js.map