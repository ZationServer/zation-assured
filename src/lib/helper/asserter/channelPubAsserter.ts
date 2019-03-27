/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test}                   from "../data/test";
import {TimeoutAssert}          from "../timeout/timeoutAssert";
import {Zation as ZationClient} from 'zation-client';
import {AnyAsserter}            from "./anyAsserter";

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
            this._test.test(async () => {
                if(!getPub){
                    const toa = new TimeoutAssert
                    (`Client: ${i} should get a publish in the channel: ${this._chName} ${
                        this._event === null ? ' with all events' : ('with the event: ' + this._event)}.`
                        ,this._timeout);

                    resolve = toa.resolve;
                    toa.onSuccess(() => {
                        this._checkPubData(pubData,i);
                    });
                    await toa.set();
                }
                else{
                    this._checkPubData(pubData,i);
                }
            });
        });
        return this._source;
    }
}