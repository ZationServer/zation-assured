/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {ValidationCheck, ValidationRequestBuilder as NativeValidationRequestBuilder, Zation as ZationClient} from "zation-client";
import {Test} from "../data/test";

export class ValidationRequestBuilder extends AbstractRequestBuilder<ValidationRequestBuilder,NativeValidationRequestBuilder>
{
    private req : NativeValidationRequestBuilder;

    constructor(req : NativeValidationRequestBuilder, test : Test, client : ZationClient) {
        super(test,client,req);
        this.req = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the controller of the request.
     * @param controller
     * @default ''
     */
    controller(controller : string) : ValidationRequestBuilder {
        this.req.controller(controller);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController of the request.
     * @default false
     * @param isSystemController
     */
    systemController(isSystemController : boolean) : ValidationRequestBuilder {
        this.req.systemController(isSystemController);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add validation checks.
     * @param checks
     */
    checks(...checks : ValidationCheck[]) : ValidationRequestBuilder {
        this.req.checks(...checks);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add validation check.
     * @param path
     * @param value
     */
    check(path : string | string[],value : any) : ValidationRequestBuilder {
        this.req.check(path,value);
        return this;
    }

    protected self(): ValidationRequestBuilder {
        return this;
    }
}



