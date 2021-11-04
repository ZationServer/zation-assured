/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {AuthRequestBuilder as NativeAuthRequestBuilder, Client} from "zation-client";
import {Test} from "../../test/test";

export class AuthRequestBuilder extends AbstractRequestBuilder<AuthRequestBuilder, NativeAuthRequestBuilder> {
    private req: NativeAuthRequestBuilder;

    constructor(req: NativeAuthRequestBuilder, test: Test, client: Client) {
        super(test, client, req);
        this.req = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the authData of the request.
     * @param data
     * @default undefined
     */
    authData(data: any): AuthRequestBuilder {
        this.req.authData(data);
        return this;
    }

    protected self(): AuthRequestBuilder {
        return this;
    }
}



