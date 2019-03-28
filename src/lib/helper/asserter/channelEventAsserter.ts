/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test}                   from "../data/test";
import {TimeoutAssert}          from "../timeout/timeoutAssert";
import {Zation as ZationClient} from 'zation-client';

type AddReaction = (client : ZationClient,reaction : () =>
    Promise<void>) => void;

export class ChannelEventAsserter<T> {

    protected readonly _test : Test;
    protected readonly _addOnceReaction : AddReaction;
    protected readonly _clients : ZationClient[];
    protected readonly _source : T;
    protected readonly _chName : string;
    protected readonly _eventName : string;

    private _timeout : number = 0;

    constructor(addReaction : AddReaction,clients : ZationClient[],chName : string,eventName : string,test : Test, source : T) {
        this._addOnceReaction = addReaction;
        this._clients = clients;
        this._chName = chName;
        this._eventName = eventName;
        this._test = test;
        this._source = source;
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can set a time limit in that the channel event action must happen.
     * @default
     * The default value is 0.
     */
    timeout(timeout : number) : ChannelEventAsserter<T> {
        this._timeout = timeout;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the channel event asserter.
     */
    end() : T {
        this._clients.forEach((c,i) => {
            let eventFired = false;
            let resolve;
            this._test.beforeTest(() => {
                this._addOnceReaction(c,async () => {
                    eventFired = true;
                    if(typeof resolve === 'function'){
                        resolve();
                    }
                });
            });
            this._test.test(async () => {
                if(!eventFired){
                    const toa = new TimeoutAssert
                    (`Client: ${i} should trigger the ${this._eventName} event in the channel: ${this._chName}.`
                        ,this._timeout);
                    resolve = () => {toa.resolve();};
                    await toa.set();
                }
            });
        });
        return this._source;
    }
}