/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {SpecialController, ValidationCheckPair, Client} from 'zation-client';
import {Test} from "../helper/test/test";
import {AuthRequestBuilder} from "../helper/builder/controller/authRequestBuilder";
import {ValidationCheckRequestBuilder} from "../helper/builder/controller/validationCheckRequestBuilder";
import {StandardRequestBuilder} from "../helper/builder/controller/standardRequestBuilder";
import {PackageBuilder} from "../helper/builder/receiver/packageBuilder";

export const when = (client: Client, itTestDescription?: string): WhenBuilder => {
    return WhenBuilder.when(client, itTestDescription);
};

export class WhenBuilder {

    private readonly _client: Client;
    private readonly _test: Test;

    constructor(client: Client, test: Test) {
        this._client = client;
        this._test = test;
    }

    static when(client: Client, itTestDescription?: string): WhenBuilder {
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
    request(controller: string | SpecialController, data?: any): StandardRequestBuilder {
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
    authRequest(authData?: any): AuthRequestBuilder {
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
    validationRequest(controller: string | SpecialController, ...checks: ValidationCheckPair[]): ValidationCheckRequestBuilder {
        return new ValidationCheckRequestBuilder
        (this._client.validationRequest(controller, ...checks), this._test, this._client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a PackageBuilder.
     * The PackageBuilder can be used to easily build a package send it to a receiver.
     * @example
     * when(client1).transmit('movement').data('up')
     * @param receiver
     * @param data
     */
    transmit(receiver: string, data?: any): PackageBuilder {
        return new PackageBuilder
        (this._client.transmit(receiver,data), this._test, this._client);
    }
}