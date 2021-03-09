/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../../test/test";

import {Channel} from 'zation-client';
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import DoUtils from "../../do/doUtils";
import {DataEventAsserter} from "../dataEventAsserter";

export abstract class AbstractChannelAsserter<T> {

    protected _test: Test;
    protected channels: Channel[];

    protected abstract self(): T;

    protected constructor(channels: Channel[], test: Test) {
        this._test = test;
        this.channels = channels;
    }

    protected async _forEachChannel(func: (channel: Channel, i: number) => Promise<void>) {
        let promises: Promise<void>[] = [];
        this.channels.forEach((c, i) => {
            promises.push(func(c, i));
        });
        await Promise.all(promises);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the channel is subscribed.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isSubscribed(timeout: number = 0): T {
        this._test.test(async () => {
            await this._forEachChannel(async (ch, i) => {
                if (ch.isSubscribed(false)) return;
                const toa = new TimeoutAssert(`Channel: ${i} should be subscribed.`, timeout);
                ch.onceSubscribe(() => {
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
     * Assert that the channel is unsubscribed.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isUnsubscribed(timeout: number = 0): T {
        this._test.test(async () => {
            await this._forEachChannel(async (ch, i) => {
                if (!ch.isSubscribed(false)) return;
                const toa = new TimeoutAssert(`Channel: ${i} should be unsubscribed.`, timeout);
                ch.onceUnsubscribe(() => {
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
     * With this function you can create custom assertions for a Channel.
     * @param assert
     * The assert function with params:
     * -channel the Channel
     * -index the index of the Channel
     */
    assert(assert: (channel: Channel, index: number) => Promise<void> | void): T {
        this._test.test(async () => {
            await this._forEachChannel(async (ch, i) => {
                await assert(ch, i);
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
    do(func: (channel: Channel) => void | Promise<void>, failMsg ?: string): T {
        this.channels.forEach(channel => {
            DoUtils.do(this._test, () => func(channel), failMsg);
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
    doShouldThrow(func: (channel: Channel) => void | Promise<void>, failMsg: string, ...errors: any[]): T {
        this.channels.forEach(channel => {
            DoUtils.doShouldThrow(this._test, () => func(channel), failMsg, ...errors);
        })
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the channel should get a publish.
     */
    getsPublish(event: string): DataEventAsserter<T> {
        return new DataEventAsserter<T>(this.channels.map(ch => {
            return (listener) => {
                ch.oncePublish(event,(data) => {
                    listener(data);
                });
            }
        }), "Channel", `Publish - ${event}`, this._test, this.self());
    }
}