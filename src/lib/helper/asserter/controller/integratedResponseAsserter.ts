/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {
    Client,
    Response,
    BackErrorFilter
}
    from "zation-client";
import {Test} from "../../test/test";
import {ValueAsserter} from "../value/valueAsserter";
import {BackErrorsFilterBuilder} from "../../backError/backErrorsFilterBuilder";
import {AbstractActionAsserter} from "../abstractActionAsserter";
import {ResponseData} from "../../utils/types";

const assert = require('assert');

export class IntegratedResponseAsserter<R extends Response<any>,C extends Client<any,any>> extends AbstractActionAsserter<IntegratedResponseAsserter<R,C>,C> {

    private readonly responseAsserters: ((response: R) => Promise<void> | void)[] = [];

    constructor(private readonly sendRequest: () => Promise<R>,
                test: Test, client: C) {
        super(test,client)
    }

    protected async _executeAction(): Promise<void> {
        let resp: R;
        try {resp = await this.sendRequest();}
        catch (err: any) {
            if(err instanceof Response) resp = err as R;
            else throw err;
        }
        for(let i = 0; i < this.responseAsserters.length; i++)
            await this.responseAsserters[i](resp);
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
    isSuccessful(): IntegratedResponseAsserter<R,C> {
        this.responseAsserters.push(resp => {
            assert(resp.successful, 'Response should be successful.' + this._respInfo(resp));
        })
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response is not successful.
     */
    isNotSuccessful(): IntegratedResponseAsserter<R,C> {
        this.responseAsserters.push(resp => {
            assert(!resp.successful, 'Response should be not successful.' + this._respInfo(resp));
        })
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has a result.
     */
    hasResult(): IntegratedResponseAsserter<R,C> {
        this.responseAsserters.push(resp => {
            assert(resp.result != null, `Response should have a result.`
                + this._respInfo(resp));
        })
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the result of the response.
     */
    result(): ValueAsserter<ResponseData<R>,IntegratedResponseAsserter<R,C>> {
        return new ValueAsserter<ResponseData<R>,IntegratedResponseAsserter<R,C>>(this, (test) => {
            this.responseAsserters.push(resp => {
                test(resp.result,'response data');
            })
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has specific errors with a BackErrorFilterBuilder.
     */
    hasError(): BackErrorsFilterBuilder<IntegratedResponseAsserter<R,C>>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the response has specific errors with a raw filter.
     * @param filter
     * Queric filter to filter for specific errors.
     */
    hasError(filter: BackErrorFilter): IntegratedResponseAsserter<R,C>
    hasError(filter?: BackErrorFilter): IntegratedResponseAsserter<R,C> | BackErrorsFilterBuilder<IntegratedResponseAsserter<R,C>> {
        if (filter !== undefined) {
            this.responseAsserters.push((resp) => {
                assert(resp.filter(filter).length > 0,
                    `Response should have at least one back error that matches the filter: ${JSON.stringify(filter)}.`
                    + this._respInfo(resp));
            });
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
    assert(assert: (resp: R) => void | Promise<void>): IntegratedResponseAsserter<R,C> {
        this.responseAsserters.push(resp => assert(resp));
        return this;
    }

    protected self(): IntegratedResponseAsserter<R,C> {
        return this;
    }
}