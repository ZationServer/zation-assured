/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Client} from 'zation-client';
import {AbstractClientAsserter} from "./abstractClientAsserter";
import {Test} from "../../test/test";
import {assert as cAssert} from 'chai';

export class StandaloneClientAsserter extends AbstractClientAsserter<StandaloneClientAsserter> {

    constructor(client: Client | Client[], itTestDescription?: string) {
        super(Array.isArray(client) ? client : [client], new Test(itTestDescription));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Will connect all clients (before the test).
     */
    connect(): StandaloneClientAsserter {
        this._test.beforeTest(async () => {
            await Promise.all(this.clients.map(async (client, index) => {
                try {await client.connect();}
                catch (err) {cAssert.fail(`Cannot connect the client ${index}. Error -> ` + err.stack);}
            }));
        })
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

    protected self(): StandaloneClientAsserter {
        return this;
    }
}