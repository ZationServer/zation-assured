/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Test} from "../../test/test";

import {Channel, DataType} from 'zation-client';
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import ActionUtils from "../../utils/actionUtils";
import {DataEventAsserter} from "../event/dataEventAsserter";
import {ValueAsserter} from "../value/valueAsserter";
import {CodeMetadataEventAsserter} from "../event/codeMetadataEventAsserter";
import {ChannelEvents, ChannelMember} from "../../utils/types";

export abstract class AbstractChannelAsserter<T, C extends Channel<any,any>> {

    protected _test: Test;
    protected channels: C[];

    protected abstract self(): T;

    protected constructor(channels: C[], test: Test) {
        this._test = test;
        this.channels = channels;
    }

    protected async _forEachChannel(func: (channel: C, i: number) => Promise<void>) {
        await Promise.all(this.channels.map((ch, i) => func(ch, i)));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the channel is subscribed.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isSubscribed(timeout: number = 0): T {
        this._test.test(() =>
            this._forEachChannel(async (ch, i) => {
                if (ch.isSubscribed(false)) return;
                const toa = new TimeoutAssert(`Channel: ${i} should be subscribed.`, timeout);
                ch.onceSubscribe(() => {
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
     * Asserts that the channel is unsubscribed.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isUnsubscribed(timeout: number = 0): T {
        this._test.test(() =>
            this._forEachChannel(async (ch, i) => {
                if (!ch.isSubscribed(false)) return;
                const toa = new TimeoutAssert(`Channel: ${i} should be unsubscribed.`, timeout);
                ch.onceUnsubscribe(() => {
                    toa.resolve()
                });
                await toa.set();
            })
        );
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts the current member of the channel.
     */
    member(): ValueAsserter<ChannelMember<C>,T> {
        return new ValueAsserter<ChannelMember<C>,T>(this.self(),(test) => {
            this._test.test(() =>
                this._forEachChannel(async (ch, i) => {
                    test(ch.member, `Channel: ${i} member:`);
                })
            )
        });
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
    action(action: (channel: C, index: number) => void | Promise<void>, failMsg?: string): T {
        this._test.test(() => this._forEachChannel((channel, index) =>
            ActionUtils.runAction(() =>
                action(channel,index), failMsg)));
        this._test.pushSyncWait();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the channel should get a publish.
     */
    getsPublish<E extends keyof ChannelEvents<C>>(event: E): DataEventAsserter<T,[ChannelEvents<C>[E],DataType],0> {
        return new DataEventAsserter<T,[ChannelEvents<C>[E],DataType],0>(this.channels.map(ch => {
            return (listener) => ch.oncePublish(event,listener);
        }), "channel", `publish - ${event}`, this._test, this.self(), 0);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the channel should trigger an close event.
     */
    closeTriggers(): CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1> {
        return new CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1>(this.channels.map(ch => {
            return (listener) => ch.onceClose(listener);
        }), "Channel", "close", this._test, this.self(), 0, 1);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the channel should trigger an kick out event.
     */
    kickOutTriggers(): CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1> {
        return new CodeMetadataEventAsserter<T, [number | string | undefined, any], 0, 1>(this.channels.map(ch => {
            return (listener) => ch.onceKickOut(listener);
        }), "Channel", "kick out", this._test, this.self(), 0, 1);
    }
}