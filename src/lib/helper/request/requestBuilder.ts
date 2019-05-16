/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {RequestBuilder as NativeRequestBuilder, Zation as ZationClient} from "zation-client";
import {AbstractRequestBuilder}               from "./abstractRequestBuilder";
import {Test}                                 from "../data/test";

export class RequestBuilder extends AbstractRequestBuilder<RequestBuilder,NativeRequestBuilder> {

    private req : NativeRequestBuilder;

    constructor(req : NativeRequestBuilder, test : Test, client : ZationClient) {
        super(test,client,req);
        this.req = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set request should use authentication if it is an http request and client is authenticated.
     * @param useAuth
     * @default true
     */
    useAuth(useAuth : boolean) : RequestBuilder {
        this.req.useAuth(useAuth);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the controller id of the request.
     * @param controllerId
     * @default ''
     */
    controller(controllerId : string) : RequestBuilder {
        this.req.controller(controllerId);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController of the request.
     * @default false
     * @param isSystemController
     */
    systemController(isSystemController : boolean) : RequestBuilder {
        this.req.systemController(isSystemController);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the data of the request.
     * @param data
     * @default {}
     */
    data(data : object | any[]) : RequestBuilder {
        this.req.data(data);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Attach http content to http request.
     * The attached http content will only used by post requests.
     * Can be used for attaching files.
     * @param key
     * @param data
     * @default []
     */
    attachHttpContent(key : string,data : string | Blob) : RequestBuilder {
        this.req.attachHttpContent(key,data);
        return this;
    }

    protected self(): RequestBuilder {
        return this;
    }
}