// import { Service } from "typedi";
// import { Encoding } from "../common";
// import axios from "axios";
// import fs from "fs";
// import { promisify } from "util";
// const readFile = promisify(fs.readFile);
// export class Settings {
//     eosSignService: {
//         logsConnectionString: string;
//     };
//     slackNotifications: {
//         azureQueue: {
//             connectionString: string;
//             queueName: string;
//         }
//     };
// }
// @Service()
// export class SettingsService {
//     private _settings: Settings;
//     async loadSettings(): Promise<Settings> {
//         if (process.env.SettingsUrl.startsWith("http")) {
//             const res = await axios.get<Settings>(process.env.SettingsUrl);
//             return res.data;
//         } else {
//             const str = await readFile(process.env.SettingsUrl, { encoding: Encoding.utf8 });
//             return JSON.parse(str) as Settings;
//         }
//     }
// }
//# sourceMappingURL=settingsService.js.map