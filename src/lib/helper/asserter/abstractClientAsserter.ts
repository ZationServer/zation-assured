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
import {ChannelPubAsserter}     from "./channelPubAsserter";
import {ChannelEventAsserter}   from "./channelEventAsserter";
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
                    const currentAccess = c.getTokenPanelAccess();
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
     * Assert get publish in any channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     */
    getPubAnyCh() : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
            client.channelReact().oncePubAnyCh(event,reaction);
        }, this.clients,'Any channel',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert get publish in user channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     */
    getPubUserCh() : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubUserCh(event,reaction);
            }, this.clients,'User channel',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert get publish in auth user group channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     */
    getPubAuthUserGroupCh() : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubAuthUserGroupCh(event,reaction);
            }, this.clients,'AuthUserGroup channel',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert get publish in default user group channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     */
    getPubDefaultUserGroupCh() : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubDefaultUserGroupCh(event,reaction);
            }, this.clients,'DefaultUserGroup channel',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert get publish in all channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     */
    getPubAllCh() : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubAllCh(event,reaction);
            }, this.clients,'All channel',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert get publish in custom channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     * @param name
     * You can also assert for multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also assert for multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     */
    getPubCustomCh({ name, id } : {name ?: string | string[], id ?: string | string[]}) : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubCustomCh({name,id},event,reaction);
            }, this.clients,
            AbstractClientAsserter._buildCustomChName(name,id)
            ,this._test,this.self());
    }

    private static _buildCustomChName(name: string | string[] | undefined,id: string | string[] | undefined) : string {
        return (
            'Custom channels with ' +
            (name === undefined ? 'all channel names' : ('channel names: '+name)) +
                ' and ' +
            (id === undefined ? 'all ids' : ('ids: '+id))
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert get publish in panel out channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     */
    getPubPanelOutCh() : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubPanelOutCh(event,reaction);
            }, this.clients,'PanelOut channel',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from any channel.
     */
    getKickOutAnyCh() : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutAnyCh(reaction);
            }, this.clients,'Any channel','KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from user channel.
     */
    getKickOutUserCh() : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutUserCh(reaction);
            }, this.clients,'User channel','KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from auth user group channel.
     */
    getKickOutAuthUserGroupCh() : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutAuthUserGroupCh(reaction);
            }, this.clients,'AuthUserGroup channel','KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from default user group channel.
     */
    getKickOutDefaultUserGroupCh() : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutDefaultUserGroupCh(reaction);
            }, this.clients,'DefaultUserGroup channel','KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from all channel.
     */
    getKickOutAllCh() : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutAllCh(reaction);
            }, this.clients,'All channel','KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from custom channel.
     * @param name
     * You can also assert for multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also assert for multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     */
    getKickOutCustomCh({ name, id } : {name ?: string | string[], id ?: string | string[]}) : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutCustomCh({name,id},reaction);
            }, this.clients,
            AbstractClientAsserter._buildCustomChName(name,id)
            ,'KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from panel out channel.
     */
    getKickOutPanelOutCh() : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutPanelOutCh(reaction);
            }, this.clients,'PanelOut channel','KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has subscribed the user channel.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubUserCh(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                try{if(c.hasSubUserCh()) {return;}}
                catch (e) {}
                const toa = new TimeoutAssert(`Client: ${i} should be subscribed the user channel.`,timeout);
                c.channelReact().onceSubUserCh(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has subscribed the auth user group channel.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubAuthUserGroupCh(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                try {if(c.hasSubAuthUserGroupCh()) {return;}}
                catch (e) {}
                const toa = new TimeoutAssert(`Client: ${i} should be subscribed the auth user group channel.`,timeout);
                c.channelReact().onceSubAuthUserGroupCh(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has subscribed the default user group channel.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubDefaultUserGroupCh(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.hasSubDefaultUserGroupCh()) {return;}
                const toa = new TimeoutAssert(`Client: ${i} should be subscribed the default user group channel.`,timeout);
                c.channelReact().onceSubDefaultUserGroupCh(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has subscribed the all channel.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubAllCh(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.hasSubAllCh()) {return;}
                const toa = new TimeoutAssert(`Client: ${i} should be subscribed the all channel.`,timeout);
                c.channelReact().onceSubAllCh(() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has subscribed an specific custom channel.
     * @param name
     * The custom channel name.
     * @param id
     * The custom channel id.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubCustomCh(name ?: string,id? : string,timeout : number = 0) : T {
        const isId = typeof id === 'string';
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.hasSubCustomCh(name,id)) {return;}
                const toa = new TimeoutAssert
                (`Client: ${i} should be subscribed the ${name} custom channel${isId ? ` with id: ${id}.` : '.'}`,timeout);
                c.channelReact().onceSubCustomCh({name,id},() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has subscribed the panel out channel.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubPanelOutCh(timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.hasSubPanelOutCh()) {return;}
                const toa = new TimeoutAssert(`Client: ${i} should be subscribed the panel out channel.`,timeout);
                c.channelReact().onceSubPanelOutCh(() => {toa.resolve()});
                await toa.set();
            });
        });
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