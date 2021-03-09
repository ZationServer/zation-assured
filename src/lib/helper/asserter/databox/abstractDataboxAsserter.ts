/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../../test/test";

import {Databox} from 'zation-client';
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import DoUtils from "../../do/doUtils";
import {DataEventAsserter} from "../dataEventAsserter";
import {AnyAsserter} from "../anyAsserter";

export abstract class AbstractDataboxAsserter<T> {

    protected _test: Test;
    protected databoxes: Databox[];

    protected abstract self(): T;

    protected constructor(databoxes: Databox[], test: Test) {
        this._test = test;
        this.databoxes = databoxes;
    }

    protected async _forEachDatabox(func: (databox: Databox, i: number) => Promise<void>) {
        let promises: Promise<void>[] = [];
        this.databoxes.forEach((c, i) => {
            promises.push(func(c, i));
        });
        await Promise.all(promises);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the Databox is connected.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isConnected(timeout: number = 0): T {
        this._test.test(async () => {
            await this._forEachDatabox(async (d, i) => {
                if (d.isConnected()) return;
                const toa = new TimeoutAssert(`Databox: ${i} should be connected.`, timeout);
                d.onceConnect(() => {
                    toa.resolve()
                });
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the Databox is disconnected.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isDisconnected(timeout: number = 0): T {
        this._test.test(async () => {
            await this._forEachDatabox(async (d, i) => {
                if (!d.isConnected()) return;
                const toa = new TimeoutAssert(`Databox: ${i} should be disconnected.`, timeout);
                d.onceDisconnect(() => {
                    toa.resolve()
                });
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Assert the current data of the Databox.
     */
    data(): AnyAsserter<T> {
        return new AnyAsserter<T>(this.self(), 'Databox', (test) => {
            this._test.test(async () => {
                await this._forEachDatabox(async (d, i) => {
                    test(d.data, ` ${i} data: `);
                })
            })
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Assert the current member of the Databox.
     */
    member(): AnyAsserter<T> {
        return new AnyAsserter<T>(this.self(), 'Databox', (test) => {
            this._test.test(async () => {
                await this._forEachDatabox(async (d, i) => {
                    test(d.member, ` ${i} member: `);
                })
            })
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function you can create custom assertions for a Databox.
     * @param assert
     * The assert function with params:
     * -databox the Databox
     * -index the index of the Databox
     */
    assert(assert: (databox: Databox, index: number) => Promise<void> | void): T {
        this._test.test(async () => {
            await this._forEachDatabox(async (d, i) => {
                await assert(d, i);
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test.
     * @param func
     * @param failMsg if not provided it throws the specific error.
     */
    do(func: (databox: Databox) => void | Promise<void>, failMsg ?: string): T {
        this.databoxes.forEach(databox => {
            DoUtils.do(this._test, () => func(databox), failMsg);
        })
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test
     * and assert that it should throw an error or a specific error.
     * @param func
     * @param failMsg
     * @param errors
     */
    doShouldThrow(func: (databox: Databox) => void | Promise<void>, failMsg: string, ...errors: any[]): T {
        this.databoxes.forEach(databox => {
            DoUtils.doShouldThrow(this._test, () => func(databox), failMsg, ...errors);
        })
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the Databox should trigger an DataChange event.
     */
    dataChangeTriggers(): DataEventAsserter<T> {
        return new DataEventAsserter<T>(this.databoxes.map(d => {
            return (listener) => {
                d.onceDataChange((data) => {
                    listener(data);
                });
            }
        }), "Databox", "DataChange", this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the Databox should trigger an DataTouch event.
     */
    dataTouchTriggers(): DataEventAsserter<T> {
        return new DataEventAsserter<T>(this.databoxes.map(d => {
            return (listener) => {
                d.onceDataTouch((data) => {
                    listener(data);
                });
            }
        }), "Databox", "DataTouch", this._test, this.self());
    }
}