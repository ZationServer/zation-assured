/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {
    AbstractRequestBuilder as NativeAbstractRequestBuilder,
    Client,
    Response,
    ErrorFilterEngine,
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
     * Assert that the response is successful.
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
     * Assert that the response is not successful.
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
     * Assert that the response has a result.
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
     * Assert the result of the response.
     */
    assertResult(): ValueAsserter<ResponseAsserter> {
        return new ValueAsserter<ResponseAsserter>(this, 'Response Result', (test) => {
            this.req.onResponse((res) => {
                test(res.getResult());
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Print the complete response to the console.
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
     * Assert that the response has a specific count of errors.
     * @param count
     * count of errors
     * @param filter
     * Filter to filter for specific errors.
     */
    hasErrorCount(count: number, ...filter: BackErrorFilter[]): ResponseAsserter {
        this.req.onResponse((res) => {
            assert(ResponseAsserter._filterErrors(res, filter).length === count,
                `Response should have ${count} back errors.${filter.length === 0 ? '' : ` With filter: ${JSON.stringify(filter)}`}`
                + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has count of specific errors
     * with filter builder.
     * @param count
     * count of errors
     */
    buildHasErrorCount(count: number): BackErrorFilterBuilder<ResponseAsserter> {
        return new BackErrorFilterBuilder(this, count);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has an specific error
     * with filter builder.
     */
    hasError(): BackErrorFilterBuilder<ResponseAsserter>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has an error.
     * @param filter
     * Filter to filter for specific errors.
     */
    hasError(...filter: BackErrorFilter[]): ResponseAsserter
    hasError(...filter: BackErrorFilter[]): ResponseAsserter | BackErrorFilterBuilder<ResponseAsserter> {
        if (filter.length > 0) {
            this.req.onResponse((res) => {
                assert(ResponseAsserter._filterErrors(res, filter).length > 0,
                    `Response should have an error.${filter.length === 0 ? '' : ` With filter: ${JSON.stringify(filter)}`}`
                    + this._respInfo(res));
            });
            return this;
        } else return new BackErrorFilterBuilder(this);
    }

    private static _filterErrors(res: Response, filter: BackErrorFilter[]): BackError[] {
        return ErrorFilterEngine.filterErrors(res.getErrors(false), filter);
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