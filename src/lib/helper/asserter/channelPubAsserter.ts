/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test}                   from "../data/test";
import {TimeoutAssert}          from "../timeout/timeoutAssert";
import {Zation as ZationClient} from 'zation-client';
import {AnyAsserter}            from "./anyAsserter";
const assert                  = require('assert');

type AddReaction = (client : ZationClient,event : string | string[] | null,reaction : (data : any) =>
    Promise<void>) => void;

export class ChannelPubAsserter<T> {

    protected readonly _test : Test;
    protected readonly _addOnceReaction : AddReaction;
    protected readonly _clients : ZationClient[];
    protected readonly _source : T;
    protected readonly _chName : string;

    private readonly _pubDataChecker : ((data : any,info : string) => void)[] = [];

    private _timeout : number = 0;
    private _event : string | string[] | null = null;
    private _not : boolean = false;

    constructor(addReaction : AddReaction,clients : ZationClient[],chName : string,test : Test, source : T) {
        this._addOnceReaction = addReaction;
        this._clients = clients;
        this._chName = chName;
        this._test = test;
        this._source = source;
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can set a time limit in that the publish action must happen.
     * @default
     * The default value is 0.
     */
    timeout(timeout : number) : ChannelPubAsserter<T> {
        this._timeout = timeout;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you set that the client should not get a publish.
     * @default
     * The default value is false.
     */
    not() : ChannelPubAsserter<T> {
        this._not = true;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can filter for a specific event.
     * @param event
     * You can also filter multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @default
     * The default value is null.
     */
    event(event : string | string[] | null ) : ChannelPubAsserter<T> {
        this._event = event;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert the published data.
     * Notice that the pub data will not checked in (get not) mode.
     */
    assertPubData() : AnyAsserter<ChannelPubAsserter<T>> {
        return new AnyAsserter<ChannelPubAsserter<T>>(this,'',(test) => {
            this._pubDataChecker.push(test);
        });
    }

    private _checkPubData(data,clientIndex : number) {
        this._pubDataChecker.forEach((f) => {
            f(data,`Client: ${clientIndex} publish in channel: ${this._chName} -> Published data `);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the channel publish asserter.
     */
    end() : T {
        this._clients.forEach((c,i) => {
            let getPub = false;
            let pubData;
            let resolve;
            this._test.beforeTest(() => {
                this._addOnceReaction(c,this._event,async (data) => {
                    pubData = data;
                    getPub = true;
                    if(typeof resolve === 'function'){
                        resolve();
                    }
                });
            });
            const failMsg = `Client: ${i} should get ${this._not ? 'not' : ''} a publish in the channel: ${this._chName} ${
                this._event === null ? ' with all events' : ('with the event: ' + this._event)}.`;

            this._test.test(async () => {
                if(!getPub){
                    const toa = new TimeoutAssert(failMsg,this._timeout,this._not);

                    resolve = () => {toa.resolve();};
                    await toa.set();
                    if(!this._not && toa.isSuccess()){
                        this._checkPubData(pubData,i);
                    }
                }
                else{
                    if(!this._not) {
                        this._checkPubData(pubData,i);
                    }
                    else {
                        assert.fail(failMsg);
                    }
                }
            });
        });
        return this._source;
    }
}