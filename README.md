# Lykke.Service.Eos.SignService

## Custom environment variables

- `HotWalletActivePrivateKey` - hot wallet account private key for `active` permissions

## Debug

`./.vscode/launch.json_` example is provided for debugging with VS Code. Fill in `configurations[..].env` properties with actual values before start.

## Typescript Typings

Almost all used libraries have typings as `@types/..` packages, except `eosjs` which has no typings for now. Custom typings should be placed in `./typings` folder to be used automatically (see `tsconfig.json` for details).