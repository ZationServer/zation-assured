/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../../test/test";
import {Databox, DataEventReason} from 'zation-client';
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import ActionUtils from "../../utils/actionUtils";
import {DataEventAsserter} from "../event/dataEventAsserter";
import {ValueAsserter} from "../value/valueAsserter";
import {CodeDataEventAsserter} from "../event/codeDataEventAsserter";
import {assert as cAssert} from 'chai';

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
     * Asserts that the databox is connected.
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
     * Asserts that the databox is disconnected.
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
     * Asserts the current data of the databox.
     */
    data(): ValueAsserter<T> {
        return new ValueAsserter<T>(this.self(), 'Databox', (test) => {
            this._test.test(async () => {
                await this._forEachDatabox(async (d, i) => {
                    test(d.data, ` ${i} data:`);
                })
            })
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts the current member of the databox.
     */
    member(): ValueAsserter<T> {
        return new ValueAsserter<T>(this.self(), 'Databox', (test) => {
            this._test.test(async () => {
                await this._forEachDatabox(async (d, i) => {
                    test(d.member, ` ${i} member:`);
                })
            })
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Fetches data multiple times on each databox.
     */
    fetch(times: number = 1, fetchData?: any): T {
        this._test.test(async () => {
            await Promise.all(this.databoxes.map(async (databox,number) => {
                const promises: Promise<void>[] = [];
                for(let i = 1; i <= times; i++) {
                    promises.push((async () => {
                        try {await databox.fetch(fetchData);}
                        catch (err) {cAssert.fail(`Databox ${number} fetch ${i} failed. Error -> ` + err.stack)}
                    })());
                }
                await Promise.all(promises);
            }));
        })
        this._test.pushSyncWait();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function lets you do extra actions on each databox and asserts that no error is thrown.
     * When an error throws, it lets the test fail with the provided message or the concrete error.
     * @param action
     * @param message if not provided it throws the specific error.
     */
    action(action: (databox: Databox, index: number) => void | Promise<void>, message?: string): T {
        this.databoxes.forEach((databox,index) => {
            ActionUtils.action(this._test, () => action(databox,index), message);
        })
        this._test.pushSyncWait();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function lets you do extra actions on each databox and
     * asserts that an error or an error instance of a specific class is thrown.
     * When no error is thrown, or the error does not match with the given classes
     * (only if at least one class is given), it lets the test fail with the provided message.
     * @param action
     * @param message
     * @param validErrorClasses
     */
    actionShouldThrow(action: (databox: Databox, index: number) => void | Promise<void>,
                      message: string, ...validErrorClasses: any[]): T {
        this.databoxes.forEach((databox,index) => {
            ActionUtils.actionShouldThrow(this._test, () => action(databox,index), message, ...validErrorClasses);
        });
        this._test.pushSyncWait();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an DataChange event.
     * It is also possible to assert only in case of specific data event reasons.
     */
    dataChangeTriggers(...reasons: DataEventReason[]): DataEventAsserter<T> {
        return new DataEventAsserter<T>(this.databoxes.map(d => {
            return (listener) => {
                let handler;
                d.onDataChange(handler = (data,triggerReasons) => {
                    if(reasons.length === 0 || (triggerReasons.findIndex(r => reasons.indexOf(r) !== -1) !== -1)) {
                        d.offDataChange(handler);
                        listener(data);
                    }
                });
            }
        }), "Databox", "DataChange",
            this._test, this.self(), ((reasons.length > 0) ? ` with any of these reasons: [${reasons}]` : ''));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an DataTouch event.
     * It is also possible to assert only in case of specific data event reasons.
     */
    dataTouchTriggers(...reasons: DataEventReason[]): DataEventAsserter<T> {
        return new DataEventAsserter<T>(this.databoxes.map(d => {
            return (listener) => {
                let handler;
                d.onDataTouch(handler = (data,triggerReasons) => {
                    if(reasons.length === 0 || (triggerReasons.findIndex(r => reasons.indexOf(r) !== -1) !== -1)) {
                        d.offDataTouch(handler);
                        listener(data);
                    }
                });
            }
        }), "Databox", "DataTouch",
            this._test, this.self(), ((reasons.length > 0) ? ` with any of these reasons: [${reasons}]` : ''));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an Close event.
     */
    closeTriggers(): CodeDataEventAsserter<T> {
        return new CodeDataEventAsserter<T>(this.databoxes.map(d => {
            return (listener) => {
                d.onceClose((code, data) => {
                    listener(data,code);
                });
            }
        }), "Databox", "Close", this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an KickOut event.
     */
    kickOutTriggers(): CodeDataEventAsserter<T> {
        return new CodeDataEventAsserter<T>(this.databoxes.map(d => {
            return (listener) => {
                d.onceKickOut((code, data) => {
                    listener(data,code);
                });
            }
        }), "Databox", "KickOut", this._test, this.self());
    }
}