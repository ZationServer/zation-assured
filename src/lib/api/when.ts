/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ValidationCheckPair, ZationClient} from 'zation-client';
import {Test} from "../helper/data/test";
import {AuthRequestBuilder} from "../helper/controller/request/authRequestBuilder";
import {ValidationCheckRequestBuilder} from "../helper/controller/request/validationCheckRequestBuilder";
import {StandardRequestBuilder} from "../helper/controller/request/standardRequestBuilder";
import {SpecialController} from "zation-client/dist/lib/main/controller/controllerDefinitions";

export const when = (client: ZationClient, itTestDescription?: string): WhenBuilder => {
    return WhenBuilder.when(client, itTestDescription);
};

export class WhenBuilder {

    private readonly _client: ZationClient;
    private readonly _test: Test;

    constructor(client: ZationClient, test: Test) {
        this._client = client;
        this._test = test;
    }

    static when(client: ZationClient, itTestDescription?: string): WhenBuilder {
        return new WhenBuilder(client, new Test(itTestDescription));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an StandardRequestBuilder.
     * The StandardRequestBuilder can be used to easily build
     * a standard request.
     * The default values are:
     * Data: undefined
     * @example
     * when(client1).request('sendMessage')
     * .data({msg: 'hallo'})
     * ...
     * @param controller
     * @param data
     */
    request(controller: string | SpecialController, data: any = undefined): StandardRequestBuilder {
        return new StandardRequestBuilder(this._client.request(controller, data), this._test, this._client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an AuthRequestBuilder.
     * The AuthRequestBuilder can be used to easily build
     * an auth request.
     * The default values are:
     * AuthData: undefined
     * @example
     * when(client1).authRequest()
     * .authData({userName : 'luca',password : '123'})
     * ...
     * @param authData
     */
    authRequest(authData: object = {}): AuthRequestBuilder {
        return new AuthRequestBuilder
        (this._client.authRequest(authData), this._test, this._client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an ValidationCheckRequestBuilder.
     * The ValidationCheckRequestBuilder can be used to easily build
     * a validation check request.
     * The default values are:
     * Checks: []
     * @example
     * when(client1).validationRequest('sendMessage')
     * .check('msg','hallo')
     * ....
     * @param controller
     * @param checks
     */
    validationRequest(controller: string | SpecialController = '', ...checks: ValidationCheckPair[]): ValidationCheckRequestBuilder {
        return new ValidationCheckRequestBuilder
        (this._client.validationRequest(controller, ...checks), this._test, this._client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things before the test.
     * Subscribe a channel, publish to a channel...
     */
    do(func: () => void | Promise<void>): WhenBuilder {
        this._test.beforeTest(async () => {
            await func();
        }, true);
        return this;
    }
}