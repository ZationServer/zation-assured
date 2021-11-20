/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Channel, Databox, TimeoutError, Client} from "zation-client";
import {Test} from "../test/test";
import {WhenBuilder} from "../../api/when";
import {ClientAsserter} from "./client/clientAsserter";
import ActionUtils from "../utils/actionUtils";
import {DataboxAsserter} from "./databox/databoxAsserter";
import {ChannelAsserter} from "./channel/channelAsserter";
const assert = require('assert');

export abstract class AbstractActionAsserter<T, C extends Client<any,any>> {

    protected readonly _test: Test;
    protected readonly _client: C;

    private _shouldThrowTimeoutError: boolean = false;

    protected constructor(test: Test, client: C) {
        this._test = test;
        this._client = client;

        this._createTest();
    }

    protected abstract _executeAction(): Promise<void>

    private _createTest() {
        this._test.test(async () => {
            try {
                await this._executeAction();
                if (this._shouldThrowTimeoutError)
                    assert.fail('Send should throw a timeout error.');
            } catch (e) {
                if (e instanceof TimeoutError) {
                    if (!this._shouldThrowTimeoutError)
                        assert.fail('Send should not throw a timeout error.');
                } else throw e;
            }
        });
        this._test.pushSyncWait();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the when action should not throw or throw a TimeoutError.
     * @param assertion
     */
    throwsTimeoutError(assertion: boolean = true): T {
        this._shouldThrowTimeoutError = assertion;
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
    action(action: (client: C) => void | Promise<void>, failMsg?: string): T {
        this._test.test(() => ActionUtils.runAction(() => action(this._client), failMsg));
        this._test.pushSyncWait();
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start with a new when and link them to one test.
     */
    get and(): WhenBuilder<C> {
        this._test.newSubTest();
        return new WhenBuilder(this._client, this._test);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Create assertions on the client.
     */
    client(): ClientAsserter<T,C> {
        return new ClientAsserter<T,C>([this._client], this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Create assertions on other clients.
     * Notice that this method will not automatically connect the clients.
     */
    otherClients<C extends Client<any,any>>(...clients: C[]): ClientAsserter<T,C> {
        return new ClientAsserter<T,C>(clients, this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Create assertions on other databoxes.
     * Notice that this method will not automatically connect the databoxes.
     */
    otherDataboxes<D extends Databox<any,any,any,any>>(...databoxes: D[]): DataboxAsserter<T,D> {
        return new DataboxAsserter<T,D>(databoxes, this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Create assertions on other channels.
     * Notice that this method will not automatically subscribe to the channels.
     */
    otherChannels<C extends Channel<any,any>>(...channels: C[]): ChannelAsserter<T,C> {
        return new ChannelAsserter<T,C>(channels, this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Runs the test.
     */
    async test(): Promise<void> {
        return this._test.execute();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self(): T;
}