/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {BackErrorFilter,Response} from "zation-client";
import {Test} from "../../test/test";
import {ValueAsserter} from "../value/valueAsserter";
import {BackErrorsFilterBuilder} from "../../backError/backErrorsFilterBuilder";
import {ResponseData} from "../../utils/types";

const assert = require('assert');

export default class StandaloneResponseAsserter<R extends Response<any>> {

    private readonly test: Test;
    private readonly responses: R[];

    constructor(response: R | R[], description?: string) {
        this.test = new Test(description);
        this.responses = Array.isArray(response) ? response : [response];
    }

    protected async _forEachResponse(func: (response: R, i: number) => Promise<void> | void) {
        await Promise.all(this.responses
            .map((resp, i) => func(resp, i)));
    }

    // noinspection JSMethodCanBeStatic
    private _respInfo(res: R) {
        return '\n   ' + res.toString();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response is successful.
     */
    isSuccessful(): StandaloneResponseAsserter<R> {
        this.test.test(() => this._forEachResponse(async (resp,i) => {
            assert(resp.successful,`Response: ${i} should be successful.` + this._respInfo(resp));
        }));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response is not successful.
     */
    isNotSuccessful(): StandaloneResponseAsserter<R> {
        this.test.test(() => this._forEachResponse(async (resp,i) => {
            assert(!resp.successful,`Response: ${i} should be not successful.` + this._respInfo(resp));
        }));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has a result.
     */
    hasResult(): StandaloneResponseAsserter<R> {
        this.test.test(() => this._forEachResponse(async (resp,i) => {
            assert(resp.result != null, `Response: ${i} should have a result.`
                + this._respInfo(resp));
        }));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the result of the response.
     */
    result(): ValueAsserter<ResponseData<R>,StandaloneResponseAsserter<R>> {
        return new ValueAsserter<ResponseData<R>,StandaloneResponseAsserter<R>>(this,(test) => {
            this.test.test(() => this._forEachResponse(async (resp,i) => {
                test(resp.result,`response: ${i} result`);
            }));
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has specific errors with a BackErrorFilterBuilder.
     */
    hasError(): BackErrorsFilterBuilder<StandaloneResponseAsserter<R>>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has specific errors with a raw filter.
     * @param filter
     * Queric filter to filter for specific errors.
     */
    hasError(filter: BackErrorFilter): StandaloneResponseAsserter<R>
    hasError(filter?: BackErrorFilter): StandaloneResponseAsserter<R> | BackErrorsFilterBuilder<StandaloneResponseAsserter<R>> {
        if (filter !== undefined) {
            this.test.test(() => this._forEachResponse(async (resp,i) => {
                assert(resp.filter(filter).length > 0,
                    `Response: ${i} should have at least one back error that matches the filter: ${JSON.stringify(filter)}.`
                    + this._respInfo(resp));
            }));
            return this;
        } else return new BackErrorsFilterBuilder(this,(filter) => {
            this.hasError(filter)
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a custom assertion.
     * @param assert
     */
    assert(assert: (resp: R) => void | Promise<void>): StandaloneResponseAsserter<R> {
        this.test.test(() => this._forEachResponse(async resp => {
            await assert(resp);
        }))
        return this;
    }

}