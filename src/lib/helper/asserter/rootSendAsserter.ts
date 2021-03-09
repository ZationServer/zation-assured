/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Channel, ConnectionRequiredError, Databox, TimeoutError, ZationClient,} from "zation-client";
import {Test} from "../test/test";
import {WhenBuilder} from "../../api/when";
import {ClientAsserter} from "./client/clientAsserter";
import DoUtils from "../do/doUtils";
import {DataboxAsserter} from "./databox/databoxAsserter";
import {ChannelAsserter} from "./channel/channelAsserter";
const assert = require('assert');

export abstract class RootSendAsserter<T> {

    protected readonly _test: Test;
    protected readonly _client: ZationClient;

    private autoConnectedClient: boolean = false;

    private _shouldThrowTimeoutError: boolean = false;
    private _shouldThrowConnectionRequiredError: boolean = false;

    protected constructor(test: Test, client: ZationClient) {
        this._test = test;
        this._client = client;

        this._createTest();
    }

    protected abstract _executeAction(): Promise<void>

    private _createTest() {
        this._test.test(async () => {
            if (!this._client.isConnected() && this.autoConnectedClient) {
                await this._client.connect();
            }
            try {
                await this._executeAction();
                if (this._shouldThrowTimeoutError) {
                    assert.fail('Send should throw a timeout error.');
                }
                if (this._shouldThrowConnectionRequiredError) {
                    assert.fail('Send should throw a connection required error.');
                }
            } catch (e) {
                if (e instanceof TimeoutError) {
                    if (!this._shouldThrowTimeoutError) {
                        assert.fail('Send should not throw a timeout error.');
                    }
                } else if (e instanceof ConnectionRequiredError) {
                    if (!this._shouldThrowConnectionRequiredError) {
                        assert.fail('Send should not throw a connection required error.');
                    }
                } else throw e;
            }
        }, true);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that send should throw a timeout error.
     * @param value
     */
    throwsTimeoutError(value: boolean = true): T {
        this._shouldThrowTimeoutError = value;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that send should throw a connection required error.
     * @param value
     */
    throwsConnectionRequiredError(value: boolean = true): T {
        this._shouldThrowConnectionRequiredError = value;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test.
     * @param func
     * @param failMsg if not provided it throws the specific error.
     */
    do(func: (client: ZationClient) => void | Promise<void>, failMsg ?: string): T {
        DoUtils.do(this._test, () => func(this._client), failMsg);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test
     * and assert that it should throw an error or a specific error.
     * Subscribe a channel, publish to a channel...
     * @param func
     * @param failMsg
     * @param errors
     */
    doShouldThrow(func: (client: ZationClient) => void | Promise<void>, failMsg: string, ...errors: any[]): T {
        DoUtils.doShouldThrow(this._test, () => func(this._client), failMsg, ...errors);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start with a new when and link them to one test.
     */
    and(): WhenBuilder {
        this._test.newSubTest();
        return new WhenBuilder(this._client, this._test);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Runs the test.
     * @param autoConnect
     * Will auto connect the client
     * if the client is not connected to the server.
     */
    async test(autoConnect: boolean = false): Promise<void> {
        this.autoConnectedClient = autoConnect;
        return this._test.execute();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert client.
     */
    client(): ClientAsserter<T> {
        return new ClientAsserter<T>([this._client], this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert other clients.
     * Notice that this method will not automatically connect the clients.
     */
    otherClients(...clients: ZationClient[]): ClientAsserter<T> {
        return new ClientAsserter<T>(clients, this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert other databoxes.
     * Notice that this method will not automatically connect the databoxes.
     */
    otherDataboxes(...databoxes: Databox[]): DataboxAsserter<T> {
        return new DataboxAsserter<T>(databoxes, this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert other channels.
     * Notice that this method will not automatically subscribe to the channels.
     */
    otherChannels(...channels: Channel[]): ChannelAsserter<T> {
        return new ChannelAsserter<T>(channels, this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self(): T;
}