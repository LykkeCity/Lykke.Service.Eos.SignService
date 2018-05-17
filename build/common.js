"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=common.js.map