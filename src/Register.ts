import { decodeParams, encodeParams } from "./utils";
import { getConfig } from "./config";

/**
 * The request data for a new account register
 */
export interface RegisterRequest {
    redirectUrl: string,
    nickname?: string,
}

/**
 * Represents the response from the register request
 */
export type RegisterResponse =
  | {
        /** Indicates a successful register */
        type: "success"; 

        /** The address of the user */
        address: string,

        /** The nickname of the user */
        nickname: string
    }
  | { 
        /** Indicates an error during register */
        type: "error"; 

        /** The error code */
        errorCode: number; 

        /** The error message */
        errorMessage: string 
    };

export class Register {

    /**
     * Get the URL to redirect to for register
     * @param data 
     * @returns 
     */
    static getRequestUrl(data: RegisterRequest): string {
        const encodedData = this.encodeRequest(data);
        return `${getConfig().baseUrl}/register?data=${encodedData}`;
    }

    /**
     * Get the URL to redirect to after register
     * 
     * @param data 
     * @param url 
     * @returns 
     */
    static getResponseUrl(data: RegisterResponse, url: string): string {
        const encodedData = this.encodeResponse(data);
        return `${url}?data=${encodedData}`;
    }

    /**
     * Encode the register request data
     * @param data 
     * @returns 
     */
    static encodeRequest(data: RegisterRequest): string {
        return encodeParams(data);
    }

    /**
     * Decode the register request data
     * @param data 
     * @returns 
     */
    static decodeRequest(data: string): RegisterRequest {
        return decodeParams(data);
    }

    /**
     * Encode the register response data
     * @param data 
     * @returns 
     */
    static encodeResponse(data: RegisterResponse): string {
        return encodeParams(data);
    }

    /**
     * Decode the register response data
     * @param data 
     * @returns 
     */
    static decodeResponse(data: string): RegisterResponse {
        return decodeParams(data);
    }

    /**
     * Get the response data from the URL
     * @returns 
     */
    static getResponse(responseUrl: string): RegisterResponse {
        const url = new URL(responseUrl);
        const data = url.searchParams.get('data');
        return this.decodeResponse(data!);
    }

}