/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractRequestHelper, Zation as ZationClient, Response, ErrorFilter, ErrorFilterEngine, TaskError}
    from "zation-client";
import {Test}                  from "../data/test";
import {WhenBuilder}           from "../../api/when";
import {Logger}                from "../console/logger";
import {AnyAsserter}           from "./anyAsserter";
import {TaskErrorFilterBuilder} from "../error/taskErrorFilterBuilder";
const assert                 = require('assert');

export class ResponseAsserter {

    private req : AbstractRequestHelper<any>;
    private readonly _test : Test;
    private readonly client : ZationClient;

    constructor(req : AbstractRequestHelper<any>,test : Test,client : ZationClient) {
        this.req = req;
        this._test = test;
        this.client = client;
    }

    // noinspection JSMethodCanBeStatic
    private _respInfo(res : Response) {
        return '\n   ' + res.toString();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response is successful.
     */
    isSuccessful() : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(res.isSuccessful(),'Response should be successful.'+ this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response is not successful.
     */
    notSuccessful() : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(!res.isSuccessful(),'Response should be not successful.' + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has specific status code.
     * @param statusCode
     */
    hasStatusCode(statusCode : number) : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(res.getStatusCode() === statusCode,`Response should have status code: ${statusCode}.`
                + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has a new token.
     * This assertion only makes sense in http requests.
     */
    hasNewToken() : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(res.hasNewToken(),`Response should have a new token.`
                + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has a result.
     */
    hasResult() : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(res.hasResult(),`Response should have a result.`
                + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert the result of the response.
     */
    assertResult() : AnyAsserter<ResponseAsserter> {
        return new AnyAsserter<ResponseAsserter>(this,'Response Result',(test) => {
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
    print() : ResponseAsserter {
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
     * @param errorFilter
     * Filter to filter for specific errors.
     */
    hasErrorCount(count : number,...errorFilter : ErrorFilter[]) : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(ResponseAsserter._filterErrors(res,errorFilter).length === count,
                `Response should have ${count} errors.${errorFilter.length === 0 ? '' : ` With filter: ${JSON.stringify(errorFilter)}`}`
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
    buildHasErrorCount(count : number) : TaskErrorFilterBuilder<ResponseAsserter> {
        return new TaskErrorFilterBuilder(this,count);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has an error.
     * @param errorFilter
     * Filter to filter for specific errors.
     */
    hasError(...errorFilter : ErrorFilter[]) : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(ResponseAsserter._filterErrors(res,errorFilter).length > 0,
                `Response should have an error.${errorFilter.length === 0 ? '' : ` With filter: ${JSON.stringify(errorFilter)}`}`
                + this._respInfo(res));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has an specific error
     * with filter builder.
     */
    buildHasError() : TaskErrorFilterBuilder<ResponseAsserter> {
        return new TaskErrorFilterBuilder(this);
    }

    private static _filterErrors(res : Response,filter : ErrorFilter[]) : TaskError[] {
        return ErrorFilterEngine.filterErrors(res.getErrors(false),filter);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function you can create custom assertions for a response.
     * @param assert
     * The assert function.
     */
    assert(assert : (resp : Response) => void) : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(res);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start with a new request and link them to one test.
     */
    and() : WhenBuilder {
        return new WhenBuilder(this.client,this._test);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Run the test.
     * @param autoConnect
     * Will auto connect the client
     * if the client is not connected to the server.
     */
    test(autoConnect : boolean = false) : void {
        this._test.test(async () => {
            if(!this.client.isConnected() && autoConnect) {
                await this.client.connect();
            }
            await this.req.send(false);
        });

        this._test.execute();
    }

}