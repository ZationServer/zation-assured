/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {ValueAsserter} from "../value/valueAsserter";
import {AbstractEventAsserter} from "./abstractEventAsserter";

export abstract class AbstractDataEventAsserter<T,S,A extends [any,...any[]] = [any]> extends AbstractEventAsserter<T,S,A>{

    private readonly _dataChecker: ((data: any, info: string) => void)[] = [];

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the data of the event.
     * Notice that the data will not be checked in (get not) mode.
     */
    withData(): ValueAsserter<T> {
        return new ValueAsserter<T>(this.self(), '', (test) => {
            this._dataChecker.push(test);
        });
    }

    protected _dataCheck(data: any, index: number) {
        this._dataChecker.forEach((f) => {
            f(data, `${this._target}: ${index} event: ${this._event} -> data `);
        });
    }

    protected _onEventArgs(args, index: number) {
        this._dataCheck(args[0],index);
    }
}