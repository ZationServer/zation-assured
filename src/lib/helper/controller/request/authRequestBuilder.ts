/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {AuthRequestBuilder as NativeAuthRequestBuilder, ZationClient} from "zation-client";
import {Test} from "../../data/test";

export class AuthRequestBuilder extends AbstractRequestBuilder<AuthRequestBuilder, NativeAuthRequestBuilder> {
    private req: NativeAuthRequestBuilder;

    constructor(req: NativeAuthRequestBuilder, test: Test, client: ZationClient) {
        super(test, client, req);
        this.req = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the authData of the request.
     * @param data
     * @default undefined (equals to {} on server param based input).
     */
    authData(data: any): AuthRequestBuilder {
        this.req.authData(data);
        return this;
    }

    protected self(): AuthRequestBuilder {
        return this;
    }
}



