import { TransactionJson } from "koilib";
import { decodeParams, encodeParams } from "./utils";
import { getConfig } from "./config";

/**
 * Represents the request to the Broadcast
 */
export type BroadcastRequest = {
    /** The transaction that needs to be broadcasted */
    transactionJson: TransactionJson,

    /** The URL to redirect to after broadcast */
    redirectUrl: string,
}

/**
 * Represents the response from the Broadcast request
 */
export type BroadcastResponse =
  | {
        /** Indicates a successful broadcast */
        type: "success";
    }
  | { 
        /** Indicates an error during broadcast */
        type: "error"; 

        /** The error code */
        errorCode: number; 

        /** The error message */
        errorMessage: string 
    };

export class Broadcast {

    /**
     * Get the URL to redirect to for broadcast
     * @param data 
     * @returns 
     */
    static getRequestUrl(data: BroadcastRequest): string {
        const encodedData = this.encodeRequest(data);
        return `${getConfig().baseUrl}/broadcast?data=${encodedData}`;
    }

    /**
     * Get the URL to redirect to after broadcast
     * 
     * @param data 
     * @param url 
     * @returns 
     */
    static getResponseUrl(data: BroadcastResponse, url: string): string {
        const encodedData = this.encodeResponse(data);
        return `${url}?data=${encodedData}`;
    }

    /**
     * Encode the request data
     * @param data 
     * @returns 
     */
    static encodeRequest(data: BroadcastRequest): string {
        return encodeParams(data);
    }

    /**
     * Decode the request data
     * @param data 
     * @returns 
     */
    static decodeRequest(data: string): BroadcastRequest {
        return decodeParams(data);
    }

    /**
     * Encode the response data
     * @returns 
     */
    static encodeResponse(data: BroadcastResponse): string {
        return encodeParams(data);
    }

    /**
     * Decode the response data
     * @param data
     * @returns
     */
    static decodeResponse(data: string): BroadcastResponse {
        return decodeParams(data);
    }

    /**
     * Get the response data from the URL
     * @returns 
     */
    static getResponse(responseUrl: string): BroadcastResponse {
        const url = new URL(responseUrl);
        const data = url.searchParams.get('data');
        return this.decodeResponse(data!);
    }

}