/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Databox} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractDataboxAsserter} from "./abstractDataboxAsserter";

export class DataboxAsserter<T,D extends Databox<any, any, any, any>>
    extends AbstractDataboxAsserter<DataboxAsserter<T,D>,D>
{
    private readonly _source: T;

    constructor(databoxes: D[], test: Test, source: T) {
        super(databoxes, test);
        this._source = source;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the databox asserter.
     */
    end(): T {
        return this._source;
    }

    protected self(): DataboxAsserter<T,D> {
        return this;
    }
}