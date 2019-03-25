/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractRequestHelper, ProtocolType, Zation as ZationClient} from "zation-client";
import {Test}                  from "../data/test";
import {ResponseAssured} from "../assured/responseAssured";

export abstract class AbstractRequestBuilder<T,RT> {

    private readonly test : Test;
    private readonly client : ZationClient;
    private readonly abReq : AbstractRequestHelper<any>;

    protected constructor(test : Test, client : ZationClient,req : AbstractRequestHelper<any>) {
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
     * Set the protocolType to web socket
     */
    isWs() : T {
        this.abReq.isWs();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket
     */
    isWebSocket() : T {
        this.abReq.isWs();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to http
     */
    isHttp() : T {
        this.abReq.isHttp();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start the assert that part
     */
    assertThat() : ResponseAssured {
        return new ResponseAssured(this.abReq,this.test,this.client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self() : T;
}



