/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ValueAsserter} from "../value/valueAsserter";
import {AbstractDataEventAsserter} from "./abstractDataEventAsserter";

export class CodeDataEventAsserter<T> extends AbstractDataEventAsserter<CodeDataEventAsserter<T>,T,[any,number | string | undefined]>{

    private readonly _codeChecker: ((code: number | string | undefined, info: string) => void)[] = [];

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the code of the event.
     * Notice that the code will not be checked in (get not) mode.
     */
    withCode(): ValueAsserter<CodeDataEventAsserter<T>> {
        return new ValueAsserter<CodeDataEventAsserter<T>>(this.self(), '', (test) => {
            this._codeChecker.push(test);
        });
    }

    protected _codeCheck(code: number | string | undefined, index: number) {
        this._codeChecker.forEach((f) => {
            f(code, `${this._target}: ${index} event: ${this._event} -> code `);
        });
    }

    protected _onEventArgs(args, index: number) {
        this._dataCheck(args[0],index);
        this._codeCheck(args[1],index)
    }

    protected self(): CodeDataEventAsserter<T> {
        return this;
    }
}