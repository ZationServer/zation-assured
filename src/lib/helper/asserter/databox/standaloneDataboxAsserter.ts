/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Databox} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractDataboxAsserter} from "./abstractDataboxAsserter";

export class StandaloneDataboxAsserter extends AbstractDataboxAsserter<StandaloneDataboxAsserter> {

    constructor(databox: Databox | Databox[], itTestDescription?: string) {
        super(Array.isArray(databox) ? databox : [databox], new Test(itTestDescription));
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