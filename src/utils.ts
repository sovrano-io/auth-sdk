import { utils } from "koilib";

export function encodeParams(data: any): string {
    return utils.encodeBase64url(new TextEncoder().encode(JSON.stringify(data)));
}

export function decodeParams(data: string): any {
    return JSON.parse(new TextDecoder().decode(utils.decodeBase64url(data)));
}