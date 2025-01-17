import { decodeParams, encodeParams } from "./utils";
import { getConfig } from "./config";

/**
 * The request data for the wallet connect
 */
export interface ConnectRequest {
    /** The name of the dapp requesting the connection */
    appName: string,

    /** The URL to redirect to after connection */
    redirectUrl: string
}

/**
 * Represents the response from the connection request
 */
export type ConnectResponse =
  | {
        /** Indicates a successful connection */
        type: "success"; 

        /** The address of the user */
        address: string,

        /** The nickname of the user */
        nickname: string
    }
  | { 
        /** Indicates an error during connection */
        type: "error"; 

        /** The error code */
        errorCode: number; 

        /** The error message */
        errorMessage: string 
    };

export class Connector {

    /**
     * Get the URL to redirect to for connection
     * @param data 
     * @returns 
     */
    static getRequestUrl(data: ConnectRequest): string {
        const encodedData = this.encodeRequest(data);
        return `${getConfig().baseUrl}/connect?data=${encodedData}`;
    }

    /**
     * Get the URL to redirect to after connection
     * @param data 
     * @param url 
     * @returns 
     */
    static getResponseUrl(data: ConnectResponse, url: string): string {
        const encodedData = this.encodeResponse(data);
        return `${url}?data=${encodedData}`;
    }

    /**
     * Encode the connection request data
     * @param data 
     * @returns 
     */
    static encodeRequest(data: ConnectRequest): string {
        return encodeParams(data);
    }

    /**
     * Decode the connection request data
     * @param data 
     * @returns 
     */
    static decodeRequest(data: string): ConnectRequest {
        return decodeParams(data);
    }

    /**
     * Encode the connection response data
     * @param data 
     * @returns 
     */
    static encodeResponse(data: ConnectResponse): string {
        return encodeParams(data);
    }

    /**
     * Decode the connection response data
     * @param data 
     * @returns 
     */
    static decodeResponse(data: string): ConnectResponse {
        return decodeParams(data);
    }

    /**
     * Get the response from the URL
     * @param responseUrl 
     * @returns 
     */
    static getResponse(responseUrl: string): ConnectResponse {
        const url = new URL(responseUrl);
        const data = url.searchParams.get('data');
        return this.decodeResponse(data!);
    }

}