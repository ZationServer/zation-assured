/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {
    AbstractRequestBuilder as NativeAbstractRequestBuilder,
    ZationClient,
    Response,
    ErrorFilterEngine,
    BackError,
    TimeoutError,
    ConnectionRequiredError,
    BackErrorFilter
}
    from "zation-client";
import {Test}                   from "../data/test";
import {WhenBuilder}            from "../../api/when";
import {Logger}                 from "../console/logger";
import {AnyAsserter}            from "./anyAsserter";
import {BackErrorFilterBuilder} from "../backError/backErrorFilterBuilder";
import {ClientAsserter}         from "./clientAsserter";
import DoUtils                  from "../do/doUtils";
const assert                   = require('assert');

export class ResponseAsserter {

    private req : NativeAbstractRequestBuilder<any>;
    private readonly _test : Test;
    private readonly _client : ZationClient;
    private autoConnectedClient : boolean = false;

    private _shouldThrowTimeoutError : boolean = false;
    private _shouldThrowConnectionRequiredError : boolean = false;

    constructor(req : NativeAbstractRequestBuilder<any>, test : Test, client : ZationClient) {
        this.req = req;
        this._test = test;
        this._client = client;

        this._createTest();
    }

    private _createTest(){
        this._test.test(async () => {
            if(!this._client.isConnected() && this.autoConnectedClient) {
                await this._client.connect();
            }
            try{
                await this.req.send(false);
                if(this._shouldThrowTimeoutError){
                    assert.fail('Send should throw a timeout error.');
                }
                if(this._shouldThrowConnectionRequiredError){
                    assert.fail('Send should throw a connection required error.');
                }
            }
            catch (e) {
                if(e instanceof TimeoutError){
                    if(!this._shouldThrowTimeoutError){
                        assert.fail('Send should not throw a timeout error.');
                    }
                }
                else if(e instanceof ConnectionRequiredError){
                    if(!this._shouldThrowConnectionRequiredError){
                        assert.fail('Send should not throw a connection required error.');
                    }
                }
                else {
                    throw e;
                }
            }
        },true);
    }

    // noinspection JSMethodCanBeStatic
    private _respInfo(res : Response) {
        return '\n   ' + res.toString();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that send the request should throw a timeout error.
     * @param value
     */
    throwsTimeoutError(value : boolean = true) : ResponseAsserter {
        this._shouldThrowTimeoutError = value;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that send the request should throw a connection required error.
     * @param value
     */
    throwsConnectionRequiredError(value : boolean = true) : ResponseAsserter {
        this._shouldThrowConnectionRequiredError = value;
        return this;
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
    isNotSuccessful() : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(!res.isSuccessful(),'Response should be not successful.' + this._respInfo(res));
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
     * @param filter
     * Filter to filter for specific errors.
     */
    hasErrorCount(count : number,...filter : BackErrorFilter[]) : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(ResponseAsserter._filterErrors(res,filter).length === count,
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
    buildHasErrorCount(count : number) : BackErrorFilterBuilder<ResponseAsserter> {
        return new BackErrorFilterBuilder(this,count);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the response has an error.
     * @param filter
     * Filter to filter for specific errors.
     */
    hasError(...filter : BackErrorFilter[]) : ResponseAsserter {
        this.req.onResponse((res) => {
            assert(ResponseAsserter._filterErrors(res,filter).length > 0,
                `Response should have an error.${filter.length === 0 ? '' : ` With filter: ${JSON.stringify(filter)}`}`
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
    buildHasError() : BackErrorFilterBuilder<ResponseAsserter> {
        return new BackErrorFilterBuilder(this);
    }

    private static _filterErrors(res : Response,filter : BackErrorFilter[]) : BackError[] {
        return ErrorFilterEngine.filterErrors(res.getErrors(false),filter);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function you can create custom assertions for a response.
     * @param assert
     * The assert function with params:
     * -res The response
     */
    assert(assert : (resp : Response) => void | Promise<void>) : ResponseAsserter {
        this.req.onResponse(async (res) => {
            await assert(res);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test.
     * Subscribe a channel, publish to a channel...
     * @param func
     * @param failMsg if not provided it throws the specific error.
     */
    do(func : () => void | Promise<void>,failMsg ?: string) : ResponseAsserter {
        DoUtils.do(this._test,func,failMsg);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test
     * and assert that it should throw an error or a specific error.
     * Subscribe a channel, publish to a channel...
     * @param func
     * @param failMsg
     * @param errors
     */
    doShouldThrow(func : () => void | Promise<void>,failMsg : string,...errors : any[]) : ResponseAsserter {
        DoUtils.doShouldThrow(this._test,func,failMsg,...errors);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start with a new request and link them to one test.
     */
    and() : WhenBuilder {
        this._test.newSubTest();
        return new WhenBuilder(this._client,this._test);
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
        this.autoConnectedClient = autoConnect;
        this._test.execute();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert zation clients after request.
     */
    client(...client : ZationClient[]) : ClientAsserter<ResponseAsserter> {
        return new ClientAsserter<ResponseAsserter>(client,this._test,this);
    }
}