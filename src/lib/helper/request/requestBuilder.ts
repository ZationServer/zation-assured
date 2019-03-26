/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {RequestHelper, Zation as ZationClient} from "zation-client";
import {AbstractRequestBuilder}               from "./abstractRequestBuilder";
import {Test}                                 from "../data/test";

export class RequestBuilder extends AbstractRequestBuilder<RequestBuilder,RequestHelper> {

    private req : RequestHelper;

    constructor(req : RequestHelper,test : Test,client : ZationClient) {
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
     * Set the controller name from the request.
     * @param controllerName
     * @default ''
     */
    controller(controllerName : string) : RequestBuilder {
        this.req.controller(controllerName);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController from the request.
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
     * Set the data from the request.
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