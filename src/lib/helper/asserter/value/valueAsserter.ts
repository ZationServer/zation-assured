/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractValueAsserter} from "./abstractValueAsserter";

type AddTest = (test: (value: any, eStr ?: string) => void) => void;

export class ValueAsserter<T> extends AbstractValueAsserter<ValueAsserter<T>> {

    protected readonly _source: T;

    constructor(source: T, name: string, addTest: AddTest) {
        super(name,addTest);
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

    protected self(): ValueAsserter<T> {
        return this;
    }
}