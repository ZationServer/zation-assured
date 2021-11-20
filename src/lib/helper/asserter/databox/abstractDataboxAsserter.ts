/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Test} from "../../test/test";
import {Databox, DataEventReason, DbStorage} from 'zation-client';
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import ActionUtils from "../../utils/actionUtils";
import {DataEventAsserter} from "../event/dataEventAsserter";
import {ValueAsserter} from "../value/valueAsserter";
import {CodeMetadataEventAsserter} from "../event/codeMetadataEventAsserter";
import {assert as cAssert} from 'chai';
import forint, {ForintQuery} from "forint";
import {DataboxData, DataboxFetchData, DataboxMember} from "../../utils/types";
import {DeepReadonly} from "../../utils/types";

export abstract class AbstractDataboxAsserter<T, D extends Databox<any, any, any, any>> {

    protected _test: Test;
    protected databoxes: D[];

    protected abstract self(): T;

    protected constructor(databoxes: D[], test: Test) {
        this._test = test;
        this.databoxes = databoxes;
    }

    protected async _forEachDatabox(func: (databox: D, i: number) => Promise<void> | void) {
        await Promise.all(this.databoxes.map((db, i) => func(db, i)));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox is connected.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isConnected(timeout: number = 0): T {
        this._test.test(async () =>
            this._forEachDatabox(async (d, i) => {
                if (d.isConnected()) return;
                const toa = new TimeoutAssert(`Databox: ${i} should be connected.`, timeout);
                d.onceConnect(() => {
                    toa.resolve()
                });
                await toa.set();
            })
        );
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox is disconnected.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isDisconnected(timeout: number = 0): T {
        this._test.test(async () =>
            this._forEachDatabox(async (d, i) => {
                if (!d.isConnected()) return;
                const toa = new TimeoutAssert(`Databox: ${i} should be disconnected.`, timeout);
                d.onceDisconnect(() => {
                    toa.resolve()
                });
                await toa.set();
            })
        );
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts the current data of the databox.
     */
    data(): ValueAsserter<DeepReadonly<DataboxData<D>>, T> {
        return new ValueAsserter<DeepReadonly<DataboxData<D>>, T>(this.self(), (test) => {
            this._test.test(() =>
                this._forEachDatabox((d, i) =>
                    test(d.data, `Databox: ${i} data:`)))
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts the current member of the databox.
     */
    member(): ValueAsserter<DataboxMember<D>, T> {
        return new ValueAsserter<DataboxMember<D>, T>(this.self(), (test) => {
            this._test.test(() =>
                this._forEachDatabox((d, i) =>
                    test(d.member, `Databox: ${i} member:`)
                )
            )
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Fetches data multiple times on each databox.
     */
    fetch(times: number = 1, fetchData?: DataboxFetchData<D>): T {
        this._test.test(async () => {
            await Promise.all(this.databoxes.map(async (databox, number) => {
                const promises: Promise<void>[] = [];
                for (let i = 1; i <= times; i++) {
                    promises.push((async () => {
                        try {
                            await databox.fetch(fetchData);
                        } catch (err: any) {
                            cAssert.fail(`Databox: ${number} fetch ${i} failed. Error -> ` + err);
                        }
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
     * Runs a extra test action and asserts that no error will be thrown.
     * AssertionErrors will be rethrown, and all other errors will fail
     * the test with the provided message or the concrete error.
     * @param action
     * @param failMsg If not provided, the concrete error is used.
     */
    action(action: (databox: D, index: number) => void | Promise<void>, failMsg?: string): T {
        this._test.test(() =>
            this._forEachDatabox((databox, index) =>
                ActionUtils.runAction(() => action(databox, index), failMsg)))
        this._test.pushSyncWait();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an data change event.
     * It is also possible to filter for specific data event reasons with a forint query.
     */
    dataChangeTriggers(reasonFilter?: ForintQuery<DataEventReason>):
        DataEventAsserter<T, [DeepReadonly<DataboxData<D>>, DataEventReason, DbStorage<DataboxData<D>>], 0> {
        const filter = reasonFilter ? forint(reasonFilter) : () => true;
        return new DataEventAsserter<T, [DeepReadonly<DataboxData<D>>, DataEventReason, DbStorage<DataboxData<D>>], 0>
        (this.databoxes.map(d => {
                return (listener) => {
                    let handler;
                    d.onDataChange(handler = (data, reason: DataEventReason, storage) => {
                        if (filter(reason)) {
                            d.offDataChange(handler);
                            listener(data, reason, storage);
                        }
                    });
                }
            }), "Databox", "data change",
            this._test, this.self(), 0,
            ((reasonFilter) ? ` with reasons that match the filter: ${reasonFilter}` : ''));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an data touch event.
     * It is also possible to filter for specific data event reasons with a forint query.
     */
    dataTouchTriggers(reasonFilter?: ForintQuery<DataEventReason>):
        DataEventAsserter<T, [DeepReadonly<DataboxData<D>>, DataEventReason, DbStorage<DataboxData<D>>], 0> {
        const filter = reasonFilter ? forint(reasonFilter) : () => true;
        return new DataEventAsserter<T, [DeepReadonly<DataboxData<D>>, DataEventReason, DbStorage<DataboxData<D>>], 0>
        (this.databoxes.map(d => {
                return (listener) => {
                    let handler;
                    d.onDataTouch(handler = (data, reason: DataEventReason, storage) => {
                        if (filter(reason)) {
                            d.offDataTouch(handler);
                            listener(data, reason, storage);
                        }
                    });
                }
            }), "Databox", "data touch",
            this._test, this.self(), 0,
            ((reasonFilter) ? ` with reasons that match the filter: ${reasonFilter}` : ''));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an close event.
     */
    closeTriggers(): CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1> {
        return new CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1>
        (this.databoxes.map(d => {
                return (listener) => d.onceClose(listener);
            }), "Databox", "close", this._test, this.self(),
             0, 1);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the databox should trigger an kick out event.
     */
    kickOutTriggers(): CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1> {
        return new CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1>
        (this.databoxes.map(d => {
                return (listener) => d.onceKickOut(listener);
            }), "Databox", "kick out", this._test, this.self(),
            0, 1);
    }
}