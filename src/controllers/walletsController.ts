import { JsonController, Post } from "routing-controllers";
import * as uuid from "uuid";

@JsonController("/wallets")
export class WalletsController {
    /**
     * Creates a kind of "virtual" wallet in format "{ HotWalletAccount }/{ UniqueId }" for using as deposit wallet.
     * While sending funds user must use { HotWalletAccount } as "to" and { UniqueId } as "memo" fields of cash-in transaction action.
     */
    @Post()
    createWallet() {
        return {
            publicAddress: `${process.env.hotWalletAccount}/${uuid.v4()}`
        };
    }
}