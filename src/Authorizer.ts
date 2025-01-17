import { TransactionJson } from "koilib";
import { decodeParams, encodeParams } from "./utils";
import { getConfig } from "./config";

/**
 * Represents the request to the authorizer
 */
export type AuthorizerRequest = {
    /** The transaction that needs to be signed */
    transactionJson: TransactionJson,

    /** The URL to redirect to after authorization */
    redirectUrl: string,

    /** The address of the user */
    address: string
}

/**
 * Represents the response from the authorizer request
 */
export type AuthorizerResponse =
  | {
        /** Indicates a successful authorization */
        type: "success"; 

        /** The signed transaction that was authorized */
        transactionJson: TransactionJson
    }
  | { 
        /** Indicates an error during authorization */
        type: "error"; 

        /** The error code */
        errorCode: number; 

        /** The error message */
        errorMessage: string 
    };

export class Authorizer {

    /**
     * Get the URL to redirect to for authorization
     * @param data 
     * @returns 
     */
    static getRequestUrl(data: AuthorizerRequest): string {
        const encodedData = this.encodeRequest(data);
        return `${getConfig().baseUrl}/authorize?data=${encodedData}`;
    }

    /**
     * Get the URL to redirect to after authorization
     * 
     * @param data 
     * @param url 
     * @returns 
     */
    static getResponseUrl(data: AuthorizerResponse, url: string): string {
        const encodedData = this.encodeResponse(data);
        return `${url}?data=${encodedData}`;
    }

    /**
     * Encode the request data
     * @param data 
     * @returns 
     */
    static encodeRequest(data: AuthorizerRequest): string {
        return encodeParams(data);
    }

    /**
     * Decode the request data
     * @param data 
     * @returns 
     */
    static decodeRequest(data: string): AuthorizerRequest {
        return decodeParams(data);
    }

    /**
     * Encode the response data
     * @returns 
     */
    static encodeResponse(data: AuthorizerResponse): string {
        return encodeParams(data);
    }

    /**
     * Decode the response data
     * @param data
     * @returns
     */
    static decodeResponse(data: string): AuthorizerResponse {
        return decodeParams(data);
    }

    /**
     * Get the response data from the URL
     * @returns 
     */
    static getResponse(responseUrl: string): AuthorizerResponse {
        const url = new URL(responseUrl);
        const data = url.searchParams.get('data');
        return this.decodeResponse(data!);
    }

}