/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test}                   from "../data/test";
const assert                  = require('assert');
import {AuthenticationRequiredError, Zation as ZationClient} from 'zation-client';
import ObjectAsserter           from "./objectAsserter";
import {TimeoutAssert}          from "../timeout/timeoutAssert";
import DoUtils                  from "../do/doUtils";
import {EventAsserter, Responder} from "./eventAsserter";

export abstract class AbstractClientAsserter<T> {

    protected _test : Test;
    protected clients : ZationClient[];

    protected abstract self() : T;

    protected constructor(clients : ZationClient[], test : Test) {
        this._test = test;
        this.clients = clients;
    }

    protected async _forEachClient(func : (client : ZationClient,i : number) => Promise<void>) {
        let promises : Promise<void>[] = [];
        this.clients.forEach((c,i) => {
            promises.push(func(c,i));
        });
        await Promise.all(promises);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client is connected.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isConnected(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.isConnected()) {return;}
                const toa = new TimeoutAssert(`Client: ${i} should be connected.`,timeout);
                c.eventReact().onceConnect(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client is disconnected.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isDisconnected(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(!c.isConnected()){return;}
                const toa = new TimeoutAssert(`Client: ${i} should be disconnected.`,timeout);
                c.eventReact().onceDisconnect(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client is authenticated.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isAuthenticated(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.isAuthenticated()){return;}
                const toa = new TimeoutAssert(`Client: ${i} should be authenticated.`,timeout);
                c.eventReact().onceAuthenticate(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client is deauthenticated.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    isDeauthenticated(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(!c.isAuthenticated()){return;}
                const toa = new TimeoutAssert(`Client: ${i} should be deauthenticated.`,timeout);
                c.eventReact().onceDeauthenticate(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has a user id.
     * @param userId
     * If it is not given it will assert that the client has any user id.
     */
    hasUserId(userId ?: number | string) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                const currentId = c.getUserId();
                if(userId){
                    assert.equal(currentId,userId,`Client: ${i} should have the userId: ${userId}`);
                }
                else if(currentId === undefined){
                    assert.fail(`Client: ${i} should have any user id.`);
                }
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has a authUserGroup.
     * @param authUserGroup
     * If it is not given it will assert that the client has any authUserGroup.
     */
    hasAuthUserGroup(authUserGroup ?: string) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                const currentGroup = c.getAuthUserGroup();
                if(authUserGroup){
                    assert.equal(currentGroup,authUserGroup,`Client: ${i} should have the authUserGroup: ${authUserGroup}`);
                }
                else if(currentGroup === undefined){
                    assert.fail(`Client: ${i} should have any authUserGroup.`);
                }
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has a specific token id.
     */
    hasTokenId(tokenId : string) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                try {
                    const currentTokenId = c.getTokenId();
                    assert.equal(currentTokenId,tokenId,`Client: ${i} should have the tokenId: ${tokenId}`);
                }
                catch (e) {
                    if(e instanceof AuthenticationRequiredError) {
                        assert.fail(`Client: ${i} can not access the token for assert token id.`);
                    }
                    else {
                        throw e;
                    }
                }
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has panel access.
     */
    hasPanelAccess(access : boolean = true) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                try {
                    const currentAccess = c.hasPanelAccess();
                    assert.equal(currentAccess,access,`Client: ${i} should ${access ? '' : 'not'} have panel access`);
                }
                catch (e) {
                    if(e instanceof AuthenticationRequiredError) {
                        assert.fail(`Client: ${i} can not access the token for assert panel access.`);
                    }
                    else {
                        throw e;
                    }
                }
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert the token variables of the client.
     */
    assertTokenVariables() : ObjectAsserter<T> {
        return new ObjectAsserter<T>(this.self(),'Client:',(test) => {
            this._test.test(async () => {
                await this._forEachClient(async (c,i) => {
                    try {
                        test(c.getTokenVariable(),` ${i}  Token: `);
                    }
                    catch (e) {
                        if(e instanceof AuthenticationRequiredError){
                            assert.fail(`Client: ${i} can not access the token for assert token variables.`);
                        }
                        else {
                            throw e;
                        }
                    }
                });
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function you can create custom assertions for a client.
     * @param assert
     * The assert function with params:
     * -client the client
     * -index the index of the client
     */
    assert(assert : (client : ZationClient,index : number) => Promise<void> | void) : T {
        this._test.test(async () => {
           await this._forEachClient(async (c,i) => {
               await assert(c,i);
           });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test.
     * Subscribe a channel, publish to a channel...
     * @param func
     * @param failMsg if not provided it throws the specific error.
     */
    do(func : () => void | Promise<void>,failMsg ?: string) : T {
        DoUtils.do(this._test,func,failMsg);
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
    doShouldThrow(func : () => void | Promise<void>,failMsg : string,...errors : any[]) : T {
        DoUtils.doShouldThrow(this._test,func,failMsg,...errors);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client should receive an emit-event from the server.
     * It uses the custom zation event namespace
     * (so you cannot have name conflicts with internal event names).
     */
    receiveEvent(event : string,responder ?: Responder) : EventAsserter<T> {
        return new EventAsserter<T>(this.clients,event,this._test,this.self(),responder);
    }
}