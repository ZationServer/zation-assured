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

    constructor(respAsserter: T, count ?: number) {
        super();
        this.respAsserter = respAsserter;
        this.count = count;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the filter builder.
     */
    end(): T {
        this._pushTmpFilter();
        if (this.count) {
            this.respAsserter.hasErrorCount(this.count, ...this.filter);
        } else {
            this.respAsserter.hasError(...this.filter);
        }
        return this.respAsserter;
    }

    protected self(): BackErrorFilterBuilder<T> {
        return this;
    }

}