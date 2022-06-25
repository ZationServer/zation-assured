/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Databox} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractDataboxAsserter} from "./abstractDataboxAsserter";
import {assert as cAssert} from "chai";
import {DataboxMember} from "../../utils/types";

export class StandaloneDataboxAsserter<D extends Databox<any, any, any, any>>
    extends AbstractDataboxAsserter<StandaloneDataboxAsserter<D>,D> {

    constructor(databox: D | D[], description?: string) {
        super(Array.isArray(databox) ? databox : [databox], new Test(description));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connects all databoxes (before the test).
     */
    connect(member?: DataboxMember<D>): StandaloneDataboxAsserter<D> {
        this._test.beforeTest(async () => {
            await Promise.all(this.databoxes.map(async (databox, index) => {
                try {await databox.connect(member);}
                catch (err: any) {cAssert.fail(`Cannot connect the databox ${index}. Error -> ` + err);}
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

    protected self(): StandaloneDataboxAsserter<D> {
        return this;
    }
}