import { JsonController, Post, BadRequestError, NotFoundError } from "routing-controllers";
import { LogLevel, LogService } from "../services/logService";
import uuid from "uuid";

@JsonController("/wallets")
export class WalletsController {

    constructor(private log: LogService) {
    }

    /**
     * Creates a kind of "virtual" wallet in format "{ HotWalletAccount }/{ UniqueId }" for using as deposit wallet.
     * While sending funds user must use { HotWalletAccount } as "to" and { UniqueId } as "memo" fields of cash-in transaction action.
     */
    @Post()
    createWallet() {
        const id = uuid.v4();

        this.log.write(LogLevel.info, WalletsController.name, this.createWallet.name, "Wallet generated", id);

        return {
            publicAddress: `${process.env.hotWalletAccount}/${id}`
        };
    }
}