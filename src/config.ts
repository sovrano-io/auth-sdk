export type configType = {
    baseUrl?: string,
    modAllowanceContractId?: string
}

let config : configType = {
    baseUrl: process.env.AUTH_SDK_REDIRECT_URL || "https://auth.sovrano.app",
    modAllowanceContractId: process.env.MOD_ALLOWANCE_CID || "17wzMtYyyJFeft4sQLT7btR7MKSMBV7iBM"
};

export function setConfig(newConfig: configType) {
    config = { ...config, ...newConfig };
}

export function getConfig() : configType {
    return config;
}