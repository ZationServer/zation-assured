/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {
    AbstractRequestBuilder as NativeAbstractRequestBuilder,
    Client,
    Response,
    filterBackErrors,
    BackError,
    BackErrorFilter
}
    from "zation-client";
import {Test} from "../../test/test";
import {Logger} from "../../console/logger";
import {ValueAsserter} from "../value/valueAsserter";
import {BackErrorFilterBuilder} from "../../backError/backErrorFilterBuilder";
import {RootSendAsserter} from "../rootSendAsserter";

const assert = require('assert');

export class ResponseAsserter extends RootSendAsserter<ResponseAsserter> {

    private req: NativeAbstractRequestBuilder<any>;

    constructor(req: NativeAbstractRequestBuilder<any>, test: Test, client: Client) {
        super(test,client)
        this.req = req;
    }

    protected async _executeAction(): Promise<void> {
        await this.req.send(false);
    }

    // noinspection JSMethodCanBeStatic
    private _respInfo(res: Response) {
        return '\n   ' + res.toString();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response is successful.
     */
    isSuccessful(): ResponseAsserter {
        this.req.onResponse((res) => {
            assert(res.isSuccessful(), 'Response should be successful.' + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response is not successful.
     */
    isNotSuccessful(): ResponseAsserter {
        this.req.onResponse((res) => {
            assert(!res.isSuccessful(), 'Response should be not successful.' + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has a result.
     */
    hasResult(): ResponseAsserter {
        this.req.onResponse((res) => {
            assert(res.hasResult(), `Response should have a result.`
                + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the result of the response.
     */
    result(): ValueAsserter<ResponseAsserter> {
        return new ValueAsserter<ResponseAsserter>(this, 'Response Result', (test) => {
            this.req.onResponse((res) => {
                test(res.getResult());
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Prints the complete response to the console.
     */
    print(): ResponseAsserter {
        this.req.onResponse((res) => {
            Logger.logInfo(res.toString());
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has a specific count of errors with a BackErrorFilterBuilder.
     * @param count
     * Expected count of errors
     */
    hasErrorCount(count: number): BackErrorFilterBuilder<ResponseAsserter>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has a specific count of errors with a raw filter.
     * @param count
     * Expected count of errors
     * @param filter
     * Forint filter to filter for specific errors.
     */
    hasErrorCount(count: number, filter: BackErrorFilter): ResponseAsserter
    hasErrorCount(count: number, filter?: BackErrorFilter): ResponseAsserter | BackErrorFilterBuilder<ResponseAsserter> {
        if(filter !== undefined) {
            this.req.onResponse((res) => {
                assert(ResponseAsserter._filterBackErrorsOfResp(res,filter).length === count,
                    `The response should have ${count} BackError${count === 1 ? '' : 's'} that matches the filter: ${JSON.stringify(filter)}.`
                    + this._respInfo(res));
            });
            return this;
        }
        else return new BackErrorFilterBuilder(this, count);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has specific errors with a BackErrorFilterBuilder.
     */
    hasError(): BackErrorFilterBuilder<ResponseAsserter>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has specific errors with a raw filter.
     * @param filter
     * Forint filter to filter for specific errors.
     */
    hasError(filter: BackErrorFilter): ResponseAsserter
    hasError(filter?: BackErrorFilter): ResponseAsserter | BackErrorFilterBuilder<ResponseAsserter> {
        if (filter !== undefined) {
            this.req.onResponse((res) => {
                assert(ResponseAsserter._filterBackErrorsOfResp(res,filter).length > 0,
                    `The response should have at least one error that matches the filter: ${JSON.stringify(filter)}.`
                    + this._respInfo(res));
            });
            return this;
        } else return new BackErrorFilterBuilder(this);
    }

    private static _filterBackErrorsOfResp(res: Response, filter?: BackErrorFilter): BackError[] {
        return filterBackErrors(res.getErrors(false), filter);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function you can create custom assertions for a response.
     * @param assert
     * The assert function with params:
     * -res The response
     */
    assert(assert: (resp: Response) => void | Promise<void>): ResponseAsserter {
        this.req.onResponse(async (res) => {
            await assert(res);
        });
        return this;
    }

    protected self(): ResponseAsserter {
        return this;
    }
}