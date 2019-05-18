/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType, ValidationCheck, Zation as ZationClient} from 'zation-client';
import {RequestBuilder}         from "../helper/request/requestBuilder";
import {Test}                   from "../helper/data/test";
import {AuthRequestBuilder} from "../helper/request/authRequestBuilder";
import {ValidationRequestBuilder} from "../helper/request/validationRequestBuilder";

export const when = (client : ZationClient,testDescription ?: string) : WhenBuilder => {
    return WhenBuilder.when(client,testDescription);
};

export class WhenBuilder {

    private readonly _client : ZationClient;
    private readonly _test : Test;

    private static counter : number = 0;

    constructor(client : ZationClient,test : Test) {
        this._client = client;
        this._test = test;
        WhenBuilder.counter++;
    }

    static when(client : ZationClient,testDescription : string = `When test number: ${WhenBuilder.counter}`) : WhenBuilder {
        return new WhenBuilder(client,new Test(testDescription));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an request builder.
     * Where you can easy build an request.
     * The default values are:
     * Protocol: WebSocket
     * Controller: ''
     * Data: {}
     * SystemController: false
     * UseAuth: true
     * AttachedHttpContent: []
     * @example
     * when(client1).request()
     * .controller('sendMessage')
     * .data({msg : 'hallo'})
     * ....
     * @param controller
     * @param data
     */
    request(controller : string = '',data : object = {}) : RequestBuilder {
        return new RequestBuilder
        (this._client.request(controller,data),this._test,this._client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an auth request builder.
     * Where you can easy build an auth request.
     * The default values are:
     * Protocol: WebSocket
     * AuthData: {}
     * AttachedHttpContent: []a
     * @example
     * when(client1).authRequest()
     * .authData({userName : 'luca',password : '123'})
     * ...
     * @param authData
     * @param protocolType
     */
    authRequest(authData : object = {}, protocolType : ProtocolType = ProtocolType.WebSocket) : AuthRequestBuilder {
        return new AuthRequestBuilder
        (this._client.authRequest(authData,protocolType),this._test,this._client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an validation request helper.
     * Where you can easy build an validation request.
     * This is useful for validate individual controller parameters.
     * The default values are:
     * Protocol: WebSocket
     * Controller: ''
     * Checks: []
     * @example
     * when(client1).validationRequest()
     * .controller('sendMessage')
     * .check('msg','hallo')
     * ....
     * @param controller
     * @param checks
     */
    validationRequest(controller : string = '',...checks : ValidationCheck[]) : ValidationRequestBuilder {
        return new ValidationRequestBuilder
        (this._client.validationRequest(controller,...checks),this._test,this._client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things before the test.
     * Subscribe a channel, publish to a channel...
     */
    do(func : () => void | Promise<void>) : WhenBuilder {
        this._test.beforeTest(async () => {
            await func();
        },true);
        return this;
    }
}