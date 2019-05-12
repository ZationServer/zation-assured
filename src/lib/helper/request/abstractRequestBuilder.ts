/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractRequestBuilder as NativeAbstractRequestBuilder, ProtocolType, Zation as ZationClient} from "zation-client";
import {Test}                  from "../data/test";
import {ResponseAsserter}      from "../asserter/responseAsserter";

export abstract class AbstractRequestBuilder<T,RT> {

    private readonly test : Test;
    private readonly client : ZationClient;
    private readonly abReq : NativeAbstractRequestBuilder<any>;

    protected constructor(test : Test, client : ZationClient,req : NativeAbstractRequestBuilder<any>) {
        this.test = test;
        this.client = client;
        this.abReq = req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType
     * @param protocolType
     * @default webSocket
     */
    protocol(protocolType : ProtocolType) : T {
        this.abReq.protocol(protocolType);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the apiLevel of the request.
     * @param apiLevel.
     * @param apiLevel.
     * @default undefined.
     */
    apiLevel(apiLevel : number | undefined) : T {
        this.abReq.apiLevel(apiLevel);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket
     */
    isWs(value : boolean = true) : T {
        this.abReq.isWs(value);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket
     */
    isWebSocket(value : boolean = true) : T {
        this.abReq.isWs(value);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to http
     */
    isHttp(value : boolean = true) : T {
        this.abReq.isHttp(value);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the timeout of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the zation config,
     * or it can be a number that indicates the milliseconds.
     * @param timeout
     */
    timeout(timeout : null | undefined | number) : T {
        this.abReq.timeout(timeout);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start the assert that part
     */
    assertThat() : ResponseAsserter {
        return new ResponseAsserter(this.abReq,this.test,this.client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self() : T;
}



