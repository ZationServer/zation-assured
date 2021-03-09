/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Databox} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractDataboxAsserter} from "./abstractDataboxAsserter";
import {assert as cAssert} from "chai";

export class StandaloneDataboxAsserter extends AbstractDataboxAsserter<StandaloneDataboxAsserter> {

    constructor(databox: Databox | Databox[], itTestDescription?: string) {
        super(Array.isArray(databox) ? databox : [databox], new Test(itTestDescription));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Will connect all databoxes.
     */
    connect(member?: any): StandaloneDataboxAsserter {
        this._test.test(async () => {
            await Promise.all(this.databoxes.map(async (databox, index) => {
                try {await databox.connect(member);}
                catch (err) {cAssert.fail(`Cannot connect the databox ${index}. Error -> ` + err.stack);}
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

    protected self(): StandaloneDataboxAsserter {
        return this;
    }
}