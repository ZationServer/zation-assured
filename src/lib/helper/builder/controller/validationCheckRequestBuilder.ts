/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {
    ValidationCheckPair,
    ValidationCheckRequestBuilder as NativeValidationCheckRequestBuilder,
    Client
} from "zation-client";
import {Test} from "../../test/test";

export class ValidationCheckRequestBuilder extends AbstractRequestBuilder<ValidationCheckRequestBuilder, NativeValidationCheckRequestBuilder> {
    private req: NativeValidationCheckRequestBuilder;

    constructor(req: NativeValidationCheckRequestBuilder, test: Test, client: Client) {
        super(test, client, req);
        this.req = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Adds validation checks.
     * @param checks
     */
    checks(...checks: ValidationCheckPair[]): ValidationCheckRequestBuilder {
        this.req.checks(...checks);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Adds validation check.
     * @param path
     * @param value
     */
    check(path: string | string[], value: any): ValidationCheckRequestBuilder {
        this.req.check(path, value);
        return this;
    }

    protected self(): ValidationCheckRequestBuilder {
        return this;
    }
}



