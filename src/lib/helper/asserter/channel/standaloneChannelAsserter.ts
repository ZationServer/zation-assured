/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Channel} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractChannelAsserter} from "./abstractChannelAsserter";
import {assert as cAssert} from "chai";

export class StandaloneChannelAsserter extends AbstractChannelAsserter<StandaloneChannelAsserter> {

    constructor(channel: Channel | Channel[], itTestDescription?: string) {
        super(Array.isArray(channel) ? channel : [channel], new Test(itTestDescription));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Will subscribe all channels.
     */
    subscribe(member?: any): StandaloneChannelAsserter {
        this._test.test(async () => {
            await Promise.all(this.channels.map(async (channel, index) => {
                try {await channel.subscribe(member);}
                catch (err) {cAssert.fail(`Cannot subscribe to the channel ${index}. Error -> ` + err.stack);}
            }));
        })
        this._test.pushSyncWait();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Run the test.
     */
    async test(): Promise<void> {
        return this._test.execute();
    }

    protected self(): StandaloneChannelAsserter {
        return this;
    }
}