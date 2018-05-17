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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const util = __importStar(require("util"));
// EOSJS has no typings, so use it as regular node module
const Eos = require("eosjs");
const ecc = require("eosjs-ecc");
let EosService = class EosService {
    constructor() {
        this.eos = Eos.Localnet({ keyProvider: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3" });
        this.createTransaction = util.promisify(this.eos.createTransaction);
    }
    async createWallet() {
        await ecc.initialize();
        //const pub = ecc.privateToPublic("5KaLtQkmuFgiLJoHDe8EJvGJahVtfUnJH6DSqbqDpeqN2ebEZXs");
        v4();
        return new CreateWalletResponse("", "");
    }
    async signTransaction(from, to, amount) {
        const svc = Eos.Localnet({
            httpEndpoint: 'http://dev.cryptolions.io:18888',
            //keyProvider: ["5KaLtQkmuFgiLJoHDe8EJvGJahVtfUnJH6DSqbqDpeqN2ebEZXs", "5JKyVNU65er9y5xLKprVPcdYzqULkMwDKWDX6zokgX5dAAj7dVv"] // insect
            signProvider: (args) => {
                return args.sign(args.buf, "5KaLtQkmuFgiLJoHDe8EJvGJahVtfUnJH6DSqbqDpeqN2ebEZXs");
            }
        });
        let info = await svc.getAccount("insect");
        //const tx = await this.createTransaction(100);
        const tr = await svc.transfer({ from: 'insect', to: 'herbivore', quantity: '1 EOS', memo: '' }, { broadcast: false });
        //const bi = svc.fc.toBuffer("transaction", tr.transaction.transaction);
        //const si = ecc.sign(bi, "5JKyVNU65er9y5xLKprVPcdYzqULkMwDKWDX6zokgX5dAAj7dVv");
        //tr.transaction.signatures.push(si);
        //const rs = await svc.pushTransaction(tr.transaction);
        return tr;
    }
};
EosService = __decorate([
    typedi_1.Service(),
    __metadata("design:paramtypes", [])
], EosService);
exports.EosService = EosService;
//# sourceMappingURL=EosService.js.map