/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Channel} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractChannelAsserter} from "./abstractChannelAsserter";
import {assert as cAssert} from "chai";

export class StandaloneChannelAsserter<C extends Channel<any,any>>
    extends AbstractChannelAsserter<StandaloneChannelAsserter<C>,C> {

    constructor(channel: C | C[], description?: string) {
        super(Array.isArray(channel) ? channel : [channel], new Test(description));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribes all channels (before the test).
     */
    subscribe(member?: any): StandaloneChannelAsserter<C> {
        this._test.beforeTest(async () => {
            await Promise.all(this.channels.map(async (channel, index) => {
                try {await channel.subscribe(member);}
                catch (err: any) {cAssert.fail(`Cannot subscribe to the channel ${index}. Error -> ` + err);}
            }));
        })
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Runs the test.
     */
    async test(): Promise<void> {
        return this._test.execute();
    }

    protected self(): StandaloneChannelAsserter<C> {
        return this;
    }
}