export type configType = {
    baseUrl?: string,
    modAllowanceContractId?: string
}

let config : configType = {
    baseUrl: process.env.AUTH_SDK_REDIRECT_URL || "https://auth.sovrano.app",
    modAllowanceContractId: process.env.MOD_ALLOWANCE_CID || "15c3q4u6AJSYaeW1SuSSzMKTF7iyka2bm3"
};

export function setConfig(newConfig: configType) {
    config = { ...config, ...newConfig };
}

export function getConfig() : configType {
    return config;
}