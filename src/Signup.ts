import { decodeParams, encodeParams } from "./utils";
import { getConfig } from "./config";

/**
 * The request data for a new account signup
 */
export interface SignupRequest {
    redirectUrl: string,
}

/**
 * Represents the response from the signup request
 */
export type SignupResponse =
  | {
        /** Indicates a successful signup */
        type: "success"; 

        /** The address of the user */
        address: string,

        /** The nickname of the user */
        nickname: string
    }
  | { 
        /** Indicates an error during signup */
        type: "error"; 

        /** The error code */
        errorCode: number; 

        /** The error message */
        errorMessage: string 
    };

export class Signup {

    /**
     * Get the URL to redirect to for signup
     * @param data 
     * @returns 
     */
    static getRequestUrl(data: SignupRequest): string {
        const encodedData = this.encodeRequest(data);
        return `${getConfig().baseUrl}/signup?data=${encodedData}`;
    }

    /**
     * Get the URL to redirect to after signup
     * 
     * @param data 
     * @param url 
     * @returns 
     */
    static getResponseUrl(data: SignupResponse, url: string): string {
        const encodedData = this.encodeResponse(data);
        return `${url}?data=${encodedData}`;
    }

    /**
     * Encode the signup request data
     * @param data 
     * @returns 
     */
    static encodeRequest(data: SignupRequest): string {
        return encodeParams(data);
    }

    /**
     * Decode the signup request data
     * @param data 
     * @returns 
     */
    static decodeRequest(data: string): SignupRequest {
        return decodeParams(data);
    }

    /**
     * Encode the signup response data
     * @param data 
     * @returns 
     */
    static encodeResponse(data: SignupResponse): string {
        return encodeParams(data);
    }

    /**
     * Decode the signup response data
     * @param data 
     * @returns 
     */
    static decodeResponse(data: string): SignupResponse {
        return decodeParams(data);
    }

    /**
     * Get the response data from the URL
     * @returns 
     */
    static getResponse(responseUrl: string): SignupResponse {
        const url = new URL(responseUrl);
        const data = url.searchParams.get('data');
        return this.decodeResponse(data!);
    }

}