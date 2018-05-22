"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
var Encoding;
(function (Encoding) {
    Encoding["base64"] = "base64";
    Encoding["utf8"] = "utf8";
})(Encoding = exports.Encoding || (exports.Encoding = {}));
;
function toBase64(obj) {
    return Buffer.from(JSON.stringify(obj)).toString(Encoding.base64);
}
exports.toBase64 = toBase64;
function fromBase64(str) {
    return JSON.parse(Buffer.from(str, Encoding.base64).toString(Encoding.utf8));
}
exports.fromBase64 = fromBase64;
class Settings {
}
exports.Settings = Settings;
async function loadSettings() {
    if (process.env.SettingsUrl.startsWith("http")) {
        return (await axios_1.default.get(process.env.SettingsUrl)).data;
    }
    else {
        return JSON.parse(await util_1.default.promisify(fs_1.default.readFile)(process.env.SettingsUrl, Encoding.utf8));
    }
}
exports.loadSettings = loadSettings;
//# sourceMappingURL=common.js.map