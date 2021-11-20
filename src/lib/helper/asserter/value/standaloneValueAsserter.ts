/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractValueAsserter} from "./abstractValueAsserter";
import {Test} from "../../test/test";

export class StandaloneValueAsserter<V> extends AbstractValueAsserter<V,StandaloneValueAsserter<V>> {

    protected _test: Test;

    constructor(value: V, description?: string) {
        super((test) => {
            this._test.test(() => test(value,'Value'))
        });
        this._test = new Test(description);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Run the test.
     */
    async test(): Promise<void> {
        return this._test.execute();
    }

    protected self(): StandaloneValueAsserter<V> {
        return this;
    }
}