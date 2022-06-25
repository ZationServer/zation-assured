/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Test} from "../../test/test";

const assert = require('assert');
import {DataboxOptions, Client, Databox, Channel} from 'zation-client';
import {TimeoutAssert} from "../../timeout/timeoutAssert";
import ActionUtils from "../../utils/actionUtils";
import {DataboxAsserter} from "../databox/databoxAsserter";
import {ChannelAsserter} from "../channel/channelAsserter";
import {ValueAsserter} from "../value/valueAsserter";
import {ClientAPI, ClientTokenPayload, Default} from "../../utils/types";

export abstract class AbstractClientAsserter<T, C extends Client<any, any>> {

    protected _test: Test;
    protected clients: C[];

    protected abstract self(): T;

    protected constructor(clients: C[], test: Test) {
        this._test = test;
        this.clients = clients;
    }

    protected async _forEachClient(func: (client: C, i: number) => Promise<void>) {
        await Promise.all(this.clients.map((client, index) => func(client, index)));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the client is connected.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isConnected(timeout: number = 0): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                if (c.connected) return;
                const toa = new TimeoutAssert(`Client: ${i} should be connected.`, timeout);
                c.onceConnect(() => {
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
     * Asserts that the client is disconnected.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isDisconnected(timeout: number = 0): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                if (!c.connected) return;
                const toa = new TimeoutAssert(`Client: ${i} should be disconnected.`, timeout);
                c.onceDisconnect(() => {
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
     * Asserts that the client is authenticated.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isAuthenticated(timeout: number = 0): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                if (c.authenticated) return;
                const toa = new TimeoutAssert(`Client: ${i} should be authenticated.`, timeout);
                c.onceAuthenticate(() => {
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
     * Asserts that the client is deauthenticated.
     * @param timeout
     * Sets a time limit in that the assertion must be successful.
     */
    isDeauthenticated(timeout: number = 0): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                if (!c.authenticated) return;
                const toa = new TimeoutAssert(`Client: ${i} should be deauthenticated.`, timeout);
                c.onceDeauthenticate(() => {
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
     * Asserts that the client has a user id.
     * @param userId
     * If it is not given it will assert that the client has any user id.
     */
    hasUserId(userId ?: number | string): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                const currentId = c.userId;
                if (userId != null)
                    assert.equal(currentId, userId, `Client: ${i} should have the userId: ${userId}`);
                else if (currentId == null)
                    assert.fail(`Client: ${i} should have any user id.`);
            })
        );
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the client has a authUserGroup.
     * @param authUserGroup
     * If it is not given it will assert that the client has any authUserGroup.
     */
    hasAuthUserGroup(authUserGroup ?: string): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                const currentGroup = c.authUserGroup;
                if (authUserGroup != null) {
                    assert.equal(currentGroup, authUserGroup,
                        `Client: ${i} should have the authUserGroup: ${authUserGroup}`);
                } else if (currentGroup == null)
                    assert.fail(`Client: ${i} should have any authUserGroup.`);
            })
        );
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the client has a specific token id.
     */
    hasTokenId(tokenId: string): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                assert.equal(c.authToken?.tid, tokenId,
                    `Client: ${i} should have the tokenId: ${tokenId}`);
            })
        );
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the client has panel access.
     */
    hasPanelAccess(access: boolean = true): T {
        this._test.test(() =>
            this._forEachClient(async (c, i) => {
                assert.equal(c.authToken?.panelAccess, access,
                    `Client: ${i} should ${access ? '' : 'not'} have panel access`);
            })
        );
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the token payload of the client.
     */
    tokenPayload(): ValueAsserter<ClientTokenPayload<C>, T> {
        return new ValueAsserter<ClientTokenPayload<C>, T>(this.self(), (test) => {
            this._test.test(() =>
                this._forEachClient(async (c, i) => {
                    test(c.authTokenPayload, `Client: ${i} token payload:`);
                })
            );
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Create assertions on a databox of the client.
     * Will automatically connect (before the test) and disconnect (after the test) the databox.
     */
    databox<DN extends keyof ClientAPI<C>['databoxes']>(identifier: DN,
                                                        member?: Default<ClientAPI<C>['databoxes'][DN]['member'], string>,
                                                        options: DataboxOptions<ClientAPI<C>['databoxes'][DN]['options'],
                                                            ClientAPI<C>['databoxes'][DN]['fetchInput']> = {}):
        DataboxAsserter<T, Databox<ClientAPI<C>['databoxes'][DN]['content'], Default<ClientAPI<C>['databoxes'][DN]['member'], string>,
            ClientAPI<C>['databoxes'][DN]['options'], ClientAPI<C>['databoxes'][DN]['fetchInput']>> {
        const databoxes = this.clients.map(client => {
            const db = client.databox(identifier, options);
            this._test.beforeTest(async () => {
                try {await db.connect(member);}
                catch (err: any) {assert.fail("Cannot connect the databox. Error -> " + err);}
            });
            this._test.afterTest(() => db.disconnect());
            return db;
        });
        return new DataboxAsserter(databoxes, this._test, this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Create assertions on a channel of the client.
     * Will automatically subscribe (before the test) and unsubscribe (after the test) the channel.
     */
    channel<CN extends keyof ClientAPI<C>['channels']>(identifier: CN,
                                                       member?: Default<ClientAPI<C>['channels'][CN]['member'],string>):
        ChannelAsserter<T,Channel<Default<ClientAPI<C>['channels'][CN]['member'],string>,
            Default<ClientAPI<C>['channels'][CN]['publishes'], Record<string,any>>>> {
        const channels = this.clients.map(client => {
            const channel = client.channel(identifier);
            this._test.beforeTest(async () => {
                try {await channel.subscribe(member);}
                catch (err: any) {assert.fail("Cannot subscribe to the channel. Error -> " + err);}
            });
            this._test.afterTest(() => channel.unsubscribe());
            return channel;
        });
        return new ChannelAsserter(channels, this._test, this.self());
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
    action(action: (client: C, index: number) => void | Promise<void>, failMsg?: string): T {
        this._test.test(() =>
            this._forEachClient((client, index) =>
                ActionUtils.runAction(() => action(client, index), failMsg)))
        this._test.pushSyncWait();
        return this.self();
    }
}