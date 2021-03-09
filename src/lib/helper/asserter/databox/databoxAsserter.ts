/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Databox} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractDataboxAsserter} from "./abstractDataboxAsserter";

export class DataboxAsserter<T> extends AbstractDataboxAsserter<DataboxAsserter<T>> {
    private readonly source: T;

    constructor(databoxes: Databox[], test: Test, source: T) {
        super(databoxes, test);
        this.source = source;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the databox asserter.
     */
    end(): T {
        return this.source;
    }

    protected self(): DataboxAsserter<T> {
        return this;
    }
}