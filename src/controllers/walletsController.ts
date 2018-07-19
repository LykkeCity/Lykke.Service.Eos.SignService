import { JsonController, Post } from "routing-controllers";
import { LogLevel, LogService } from "../services/logService";
import { ADDRESS_SEPARATOR, Settings, DUMMY_PRIVATE_KEY } from "../common";
import uuid from "uuid";

@JsonController("/wallets")
export class WalletsController {

    constructor(private log: LogService, private settings: Settings) {
    }

    /**
     * Creates a kind of "virtual" wallet in format "{ HotWalletAccount }${ UniqueId }" for using as deposit wallet.
     * While sending funds user must use { HotWalletAccount } as "to" and { UniqueId } as "memo" fields of cash-in transaction action.
     */
    @Post()
    createWallet() {
        let publicAddress = `${this.settings.EosSignService.HotWalletAccount}${ADDRESS_SEPARATOR}${uuid.v4()}`;

        this.log.write(LogLevel.info, WalletsController.name, this.createWallet.name, "Wallet generated", publicAddress);

        return {
            privateKey: DUMMY_PRIVATE_KEY,
            publicAddress
        };
    }
}