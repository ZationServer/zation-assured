/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractValueAsserter} from "./abstractValueAsserter";

type AddTest = (test: (value: any, target: string) => void) => void;

export class ValueAsserter<V,T> extends AbstractValueAsserter<V,ValueAsserter<V,T>> {

    protected readonly _source: T;

    constructor(source: T, addTest: AddTest) {
        super(addTest);
        this._source = source;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the value asserter.
     */
    end(): T {
        return this._source;
    }

    protected self(): ValueAsserter<V,T> {
        return this;
    }
}