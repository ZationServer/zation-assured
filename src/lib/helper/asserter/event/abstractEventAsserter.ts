/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Test} from "../../test/test";
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import {ValueAsserter} from "../value/valueAsserter";

const assert = require('assert');

export type EventOnceListenerAdder<A extends any[]> = (listener: (...data: A) => void) => void;

export abstract class AbstractEventAsserter<T,S,A extends any[] = [any]> {

    protected readonly _test: Test;
    protected readonly _source: S;

    protected abstract self(): T;

    protected readonly _eventOnceListenerAdder: EventOnceListenerAdder<A>[];
    protected readonly _target: string;
    protected readonly _event: string;

    private _timeout: number = 200;
    private _not: boolean = false;

    protected readonly _argsAsserter: ((args: A, target: string) => void)[] = [];

    protected constructor(eventOnceListenerAdder: EventOnceListenerAdder<A>[], target: string, event: string,
                          test: Test, source: S, private messagePostfix: string = '') {
        this._eventOnceListenerAdder = eventOnceListenerAdder;
        this._target = target;
        this._event = event;
        this._test = test;
        this._source = source;
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets a time limit in milliseconds in that the event should occur.
     * @default
     * The default value is 200ms.
     */
    timeout(timeout: number): T {
        this._timeout = timeout;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets that the event should not occur.
     * @default
     * The default value is false.
     */
    not(): T {
        this._not = true;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts an argument value of the event.
     * Notice that the argument will not be checked in (get not) mode.
     */
    withArgument<AI extends number>(argIndex: AI): ValueAsserter<A[AI],T> {
        return new ValueAsserter<A[AI],T>(this.self(), (test) => {
            this._argsAsserter.push((args,target) => {
                test(args[argIndex],target + `argument: ${argIndex}`);
            });
        });
    }

    private _assertEventArgs(args: A, index: number) {
        this._argsAsserter.forEach(asserter => asserter(args,
            `${this._target}: ${index} event: ${this._event} -> `));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the event asserter.
     */
    end(): S {
        this._eventOnceListenerAdder.forEach((addListener, i) => {
            let receivedEmit = false, listenerArgs, resolve: () => void;
            this._test.beforeTest(() => {
                addListener((...args) => {
                    listenerArgs = args;
                    receivedEmit = true;
                    if (resolve) resolve();
                });
            });
            const failMsg = `${this._target}: ${i} should ${this._not ? 'not ' : ''}trigger the ${this._event} event${this.messagePostfix}.`;
            this._test.test(async () => {
                if (!receivedEmit) {
                    const toa = new TimeoutAssert(failMsg, this._timeout, this._not);
                    resolve = () => toa.resolve();
                    await toa.set();
                    if(!this._not) this._assertEventArgs(listenerArgs,i)
                } else {
                    if (this._not) assert.fail(failMsg);
                    else this._assertEventArgs(listenerArgs,i);
                }
            });
        });
        return this._source;
    }
}