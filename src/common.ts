export enum Encoding {
    base64 = "base64",
    utf8 = "utf8"
};

export function toBase64(obj: any): string {
    return Buffer.from(JSON.stringify(obj)).toString(Encoding.base64);
}

export function fromBase64<T>(str: string): T {
    return JSON.parse(Buffer.from(str, Encoding.base64).toString(Encoding.utf8)) as T;
}