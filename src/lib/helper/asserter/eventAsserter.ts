/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../data/test";
import {TimeoutAssert} from "../timeout/timeoutAssert";
import {ZationClient} from 'zation-client';
import {AnyAsserter} from "./anyAsserter";

const assert = require('assert');

export type Responder = (resp: (err?: (any | number), responseData?: any) => void, data: any) => void;

export class EventAsserter<T> {

    protected readonly _test: Test;
    protected readonly _clients: ZationClient[];
    protected readonly _source: T;
    protected readonly _event: string;
    protected readonly _responder: Responder;

    private readonly _dataChecker: ((data: any, info: string) => void)[] = [];

    private _timeout: number = 0;
    private _not: boolean = false;

    constructor(clients: ZationClient[], event: string, test: Test, source: T, responder: Responder = () => {
    }) {
        this._clients = clients;
        this._event = event;
        this._test = test;
        this._source = source;
        this._responder = responder;
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can set a time limit in that the event should receive.
     * @default
     * The default value is 0.
     */
    timeout(timeout: number): EventAsserter<T> {
        this._timeout = timeout;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you set that the client should not receive the event.
     * @default
     * The default value is false.
     */
    not(): EventAsserter<T> {
        this._not = true;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert the received data.
     * Notice that the data will not checked in (get not) mode.
     */
    assertData(): AnyAsserter<EventAsserter<T>> {
        return new AnyAsserter<EventAsserter<T>>(this, '', (test) => {
            this._dataChecker.push(test);
        });
    }

    private _checkData(data, clientIndex: number) {
        this._dataChecker.forEach((f) => {
            f(data, `Client: ${clientIndex} event: ${this._event} -> Received data `);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the event asserter.
     */
    end(): T {
        this._clients.forEach((c, i) => {
            let receivedEmit = false;
            let data;
            let resolve;
            this._test.beforeTest(() => {
                c.once(this._event, (d, res) => {
                    this._responder(res, d);
                    data = d;
                    receivedEmit = true;
                    if (typeof resolve === 'function') {
                        resolve();
                    }
                });
            });
            const failMsg = `Client: ${i} should ${this._not ? 'not ' : ''}receive the event: ${this._event} from the server.`;

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