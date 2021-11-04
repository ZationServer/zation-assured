/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractDataEventAsserter} from "./abstractDataEventAsserter";

export class DataEventAsserter<S,A extends [any] = [any]> extends AbstractDataEventAsserter<DataEventAsserter<S,A>,S,A>{

    protected self(): DataEventAsserter<S,A> {
        return this;
    }
}