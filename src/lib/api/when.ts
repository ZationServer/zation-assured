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

    private readonly client : ZationClient;
    private readonly test : Test;

    private static counter : number = 0;

    constructor(client : ZationClient,test : Test) {
        this.client = client;
        this.test = test;
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
     * ControllerName: ''
     * Data: {}
     * SystemController: false
     * UseAuth: true
     * AttachedHttpContent: []
     * @example
     * when(client1).request()
     * .controller('sendMessage')
     * .data({msg : 'hallo'})
     * ....
     * @param controllerName
     * @param data
     */
    request(controllerName : string = '',data : object = {}) : RequestBuilder {
        return new RequestBuilder
        (this.client.request(controllerName,data),this.test,this.client);
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
        (this.client.authRequest(authData,protocolType),this.test,this.client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an validation request helper.
     * Where you can easy build an validation request.
     * This is useful for validate individual controller parameters.
     * The default values are:
     * Protocol: WebSocket
     * ControllerName: ''
     * Checks: []
     * @example
     * when(client1).validationRequest()
     * .controller('sendMessage')
     * .check('msg','hallo')
     * ....
     * @param controllerName
     * @param checks
     */
    validationRequest(controllerName : string = '',...checks : ValidationCheck[]) : ValidationRequestBuilder {
        return new ValidationRequestBuilder
        (this.client.validationRequest(controllerName,...checks),this.test,this.client);
    }

}