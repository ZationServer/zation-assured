/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Client} from 'zation-client';
import {AbstractClientAsserter} from "./abstractClientAsserter";
import {Test} from "../../test/test";
import {assert as cAssert} from 'chai';

export class StandaloneClientAsserter<C extends Client<any, any>>
    extends AbstractClientAsserter<StandaloneClientAsserter<C>,C> {

    constructor(client: C | C[], description?: string) {
        super(Array.isArray(client) ? client : [client], new Test(description));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connects all clients (before the test).
     */
    connect(): StandaloneClientAsserter<C> {
        this._test.beforeTest(async () => {
            await Promise.all(this.clients.map(async (client, index) => {
                try {await client.connect();}
                catch (err: any) {cAssert.fail(`Cannot connect the client ${index}. Error -> ` + err);}
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

    protected self(): StandaloneClientAsserter<C> {
        return this;
    }
}