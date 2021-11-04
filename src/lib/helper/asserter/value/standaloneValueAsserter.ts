/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractValueAsserter} from "./abstractValueAsserter";
import {Test} from "../../test/test";

export class StandaloneValueAsserter extends AbstractValueAsserter<StandaloneValueAsserter> {

    protected _test: Test;

    constructor(value: any, itTestDescription?: string) {
        super('CustomValue', (test) => {
            this._test.test(() => test(value))
        });
        this._test = new Test(itTestDescription);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Run the test.
     */
    async test(): Promise<void> {
        return this._test.execute();
    }

    protected self(): StandaloneValueAsserter {
        return this;
    }
}