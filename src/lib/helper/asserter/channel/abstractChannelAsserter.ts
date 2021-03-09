/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../../test/test";

import {Channel} from 'zation-client';
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import ActionUtils from "../../do/actionUtils";
import {DataEventAsserter} from "../event/dataEventAsserter";
import {ValueAsserter} from "../value/valueAsserter";
import {CodeDataEventAsserter} from "../event/codeDataEventAsserter";

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
     * Assert the current member of the channel.
     */
    member(): ValueAsserter<T> {
        return new ValueAsserter<T>(this.self(), 'Channel', (test) => {
            this._test.test(async () => {
                await this._forEachChannel(async (ch, i) => {
                    test(ch.member, ` ${i} channel: `);
                })
            })
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function lets you do extra actions on each channel and asserts that no error is thrown.
     * When an error throws, it lets the test fail with the provided message or the concrete error.
     * @param action
     * @param message if not provided it throws the specific error.
     */
    action(action: (channel: Channel, index: number) => void | Promise<void>, message?: string): T {
        this.channels.forEach((channel,index) => {
            ActionUtils.action(this._test, () => action(channel,index), message);
        })
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function lets you do extra actions on each channel and
     * asserts that an error or an error instance of a specific class is thrown.
     * When no error is thrown, or the error does not match with the given classes
     * (only if at least one class is given), it lets the test fail with the provided message.
     * @param action
     * @param message
     * @param validErrorClasses
     */
    actionShouldThrow(action: (channel: Channel, index: number) => void | Promise<void>, message: string, ...validErrorClasses: any[]): T {
        this.channels.forEach((channel,index) => {
            ActionUtils.actionShouldThrow(this._test, () => action(channel,index), message, ...validErrorClasses);
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the channel should trigger an Close event.
     */
    closeTriggers(): CodeDataEventAsserter<T> {
        return new CodeDataEventAsserter<T>(this.channels.map(ch => {
            return (listener) => {
                ch.onceClose((code, data) => {
                    listener(data,code);
                });
            }
        }), "Channel", "Close", this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the channel should trigger an KickOut event.
     */
    kickOutTriggers(): CodeDataEventAsserter<T> {
        return new CodeDataEventAsserter<T>(this.channels.map(ch => {
            return (listener) => {
                ch.onceKickOut((code, data) => {
                    listener(data,code);
                });
            }
        }), "Channel", "KickOut", this._test, this.self());
    }
}