/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../test/test";
import {TimeoutAssert} from "../timeout/timeoutAssert";
import {AnyAsserter} from "./anyAsserter";

const assert = require('assert');

export type EventOnceListenerAdder = (listener: (data: any) => void) => void;

export class DataEventAsserter<T> {

    protected readonly _test: Test;
    protected readonly _source: T;

    protected readonly _eventOnceListenerAdder: EventOnceListenerAdder[];
    protected readonly _target: string;
    protected readonly _event: string;

    private readonly _dataChecker: ((data: any, info: string) => void)[] = [];

    private _timeout: number = 0;
    private _not: boolean = false;

    constructor(eventOnceListenerAdder: EventOnceListenerAdder[], target: string, event: string, test: Test, source: T) {
        this._eventOnceListenerAdder = eventOnceListenerAdder;
        this._target = target;
        this._event = event;
        this._test = test;
        this._source = source;
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can set a time limit in that the event should occur.
     * @default
     * The default value is 0.
     */
    timeout(timeout: number): DataEventAsserter<T> {
        this._timeout = timeout;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you set that the event should not occur.
     * @default
     * The default value is false.
     */
    not(): DataEventAsserter<T> {
        this._not = true;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert the data of the event.
     * Notice that the data will not checked in (get not) mode.
     */
    withData(): AnyAsserter<DataEventAsserter<T>> {
        return new AnyAsserter<DataEventAsserter<T>>(this, '', (test) => {
            this._dataChecker.push(test);
        });
    }

    private _checkData(data, index: number) {
        this._dataChecker.forEach((f) => {
            f(data, `${this._target}: ${index} event: ${this._event} -> data `);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the event asserter.
     */
    end(): T {
        this._eventOnceListenerAdder.forEach((addListener, i) => {
            let receivedEmit = false;
            let data;
            let resolve;
            this._test.beforeTest(() => {
                addListener((d) => {
                    data = d;
                    receivedEmit = true;
                    if (typeof resolve === 'function') {
                        resolve();
                    }
                });
            });
            const failMsg = `${this._target}: ${i} should ${this._not ? 'not ' : ''}trigger the ${this._event} event.`;

            this._test.test(async () => {
                if (!receivedEmit) {
                    const toa = new TimeoutAssert(failMsg, this._timeout, this._not);

                    resolve = () => {
                        toa.resolve();
                    };
                    await toa.set();
                    if (!this._not && toa.isSuccess()) {
                        this._checkData(data, i);
                    }
                } else {
                    if (!this._not) {
                        this._checkData(data, i);
                    } else {
                        assert.fail(failMsg);
                    }
                }
            });
        });
        return this._source;
    }
}