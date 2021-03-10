/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {StandardRequestBuilder as NativeStandardRequestBuilder, Client} from "zation-client";
import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {Test} from "../../test/test";

export class StandardRequestBuilder extends AbstractRequestBuilder<StandardRequestBuilder, NativeStandardRequestBuilder> {

    private req: NativeStandardRequestBuilder;

    constructor(req: NativeStandardRequestBuilder, test: Test, client: Client) {
        super(test, client, req);
        this.req = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the data of the request.
     * @param data
     * @default undefined (equals to {} on server param based input).
     */
    data(data: any): StandardRequestBuilder {
        this.req.data(data);
        return this;
    }

    protected self(): StandardRequestBuilder {
        return this;
    }
}