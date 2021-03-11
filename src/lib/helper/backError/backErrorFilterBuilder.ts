/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


import {AbstractBackErrorFilterBuilder} from "zation-client";
// noinspection TypeScriptPreferShortImport,ES6PreferShortImport
import {ResponseAsserter} from "../asserter/controller/responseAsserter";

export class BackErrorFilterBuilder<T extends ResponseAsserter> extends AbstractBackErrorFilterBuilder<BackErrorFilterBuilder<T>> {
    private readonly respAsserter: T;
    private readonly count: number | undefined;

    constructor(respAsserter: T, count?: number) {
        super();
        this.respAsserter = respAsserter;
        this.count = count;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Ends the filter builder.
     */
    end(): T {
        if (this.count !== undefined) this.respAsserter.hasErrorCount(this.count,this.buildFinalFilter() || {});
        else this.respAsserter.hasError(this.buildFinalFilter() || {});
        return this.respAsserter;
    }

    protected self(): BackErrorFilterBuilder<T> {
        return this;
    }

}