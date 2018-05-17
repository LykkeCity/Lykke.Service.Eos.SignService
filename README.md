# Lykke.Service.Eos.SignService

## Settings

This service doesn't get settings from settings service.
Instead, all settings are provided through environment variables:

- `HotWalletAccount` - hot wallet account name
- `HotWalletActivePrivateKey` - hot wallet account private key for `active` permissions
- `LogsConnectionString` - connection string to an Azure storage accout for logs

## Debug

`./.vscode/launch.json_` example is provided for debugging with VS Code. Fill in `configurations[..].env` properties with actual values before start.

## Typescript Typings

Almost all used libraries have typings as `@types/..` packages, except `eosjs` which has no typings for now. Custom typings should be placed in `./typings` folder to be used automatically (see `tsconfig.json` for details).