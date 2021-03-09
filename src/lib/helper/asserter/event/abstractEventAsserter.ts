/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../../test/test";
import {TimeoutAssert} from "../../timeout/timeoutAssert";

const assert = require('assert');

export type EventOnceListenerAdder<A extends any[]> = (listener: (...data: A) => void) => void;

export abstract class AbstractEventAsserter<T,S,A extends any[] = [any]> {

    protected readonly _test: Test;
    protected readonly _source: S;

    protected abstract self(): T;

    protected readonly _eventOnceListenerAdder: EventOnceListenerAdder<A>[];
    protected readonly _target: string;
    protected readonly _event: string;

    private _timeout: number = 0;
    private _not: boolean = false;

    constructor(eventOnceListenerAdder: EventOnceListenerAdder<A>[], target: string, event: string, test: Test, source: S) {
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
    timeout(timeout: number): T {
        this._timeout = timeout;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you set that the event should not occur.
     * @default
     * The default value is false.
     */
    not(): T {
        this._not = true;
        return this.self();
    }

    protected _onEventArgs(args: A, index: number) {}

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the event asserter.
     */
    end(): S {
        this._eventOnceListenerAdder.forEach((addListener, i) => {
            let receivedEmit = false;
            let listenerArgs;
            let resolve: () => void;
            this._test.beforeTest(() => {
                addListener((...args) => {
                    listenerArgs = args;
                    receivedEmit = true;
                    if (resolve) resolve();
                });
            });
            const failMsg = `${this._target}: ${i} should ${this._not ? 'not ' : ''}trigger the ${this._event} event.`;
            this._test.test(async () => {
                if (!receivedEmit) {
                    const toa = new TimeoutAssert(failMsg, this._timeout, this._not);
                    resolve = () => toa.resolve();
                    await toa.set();
                    if(!this._not) this._onEventArgs(listenerArgs,i)
                } else {
                    if (this._not) assert.fail(failMsg);
                    else this._onEventArgs(listenerArgs,i);
                }
            });
        });
        return this._source;
    }
}