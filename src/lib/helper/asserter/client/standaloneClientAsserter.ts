/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ZationClient} from 'zation-client';
import {AbstractClientAsserter} from "./abstractClientAsserter";
import {Test} from "../../test/test";

export class StandaloneClientAsserter extends AbstractClientAsserter<StandaloneClientAsserter> {

    constructor(client: ZationClient | ZationClient[], itTestDescription?: string) {
        super(Array.isArray(client) ? client : [client], new Test(itTestDescription));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Run the test.
     */
    async test(): Promise<void> {
        return this._test.execute();
    }

    protected self(): StandaloneClientAsserter {
        return this;
    }
}