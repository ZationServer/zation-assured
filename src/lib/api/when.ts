/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Zation as ZationClient} from 'zation-client';
import {RequestBuilder}         from "../helper/request/requestBuilder";
import {Test}                   from "../helper/data/test";

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
        const reqBuilder : RequestBuilder = new RequestBuilder(this.client.request(),this.test,this.client);
        reqBuilder.controller(controllerName).data(data);
        return reqBuilder;
    }

}