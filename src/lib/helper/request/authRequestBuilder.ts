/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {AuthRequestHelper, Zation as ZationClient} from "zation-client";
import {Test} from "../data/test";

export class AuthRequestBuilder extends AbstractRequestBuilder<AuthRequestBuilder,AuthRequestHelper>
{
    private req : AuthRequestHelper;

    constructor(req : AuthRequestHelper,test : Test,client : ZationClient) {
        super(test,client,req);
        this.req = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the authData of the request.
     * @param data
     * @default {}
     */
    authData(data : object | any[]) : AuthRequestBuilder {
        this.req.authData(data);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Attach http content to http request.
     * Can be used for attaching files.
     * The attached http content will only used by post requests.
     * @param key
     * @param data
     * @default []
     */
    attachHttpContent(key : string,data : string | Blob) : AuthRequestBuilder {
        this.req.attachHttpContent(key,data);
        return this;
    }

    protected self(): AuthRequestBuilder {
        return this;
    }
}



