/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Channel} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractChannelAsserter} from "./abstractChannelAsserter";

export class StandaloneChannelAsserter extends AbstractChannelAsserter<StandaloneChannelAsserter> {

    constructor(channel: Channel | Channel[], itTestDescription?: string) {
        super(Array.isArray(channel) ? channel : [channel], new Test(itTestDescription));
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