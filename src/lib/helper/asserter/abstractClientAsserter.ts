/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test}                   from "../data/test";
const assert                  = require('assert');
import {AuthenticationNeededError, Zation as ZationClient} from 'zation-client';
import ObjectAsserter           from "./objectAsserter";
import {TimeoutAssert}          from "../timeout/timeoutAssert";
import {ChannelPubAsserter} from "./channelPubAsserter";
import {ChannelEventAsserter} from "./channelEventAsserter";

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
                    if(e instanceof AuthenticationNeededError) {
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
                    if(e instanceof AuthenticationNeededError) {
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
                        if(e instanceof AuthenticationNeededError){
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
     */
    do(func : () => void | Promise<void>) : T {
        this._test.test(async () => {
            await func();
        },true);
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
     * @param chName
     * You can also assert for multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     */
    getPubCustomCh(chName : string | string[] | null) : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubCustomCh(chName,event,reaction);
            }, this.clients,
            AbstractClientAsserter._buildCustomChName(chName)
            ,this._test,this.self());
    }

    private static _buildCustomChName(chName : string | string[] | null) : string {
        return (chName === null ? 'All Custom channels' : ('Custom channels with name: '+chName))
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert get publish in custom id channel.
     * Don't forget to check before assert a publish
     * that the client has subscribed this channel.
     * @param chName
     * You can also assert for multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also assert for multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     */
    getPubCustomIdCh(chName: string | string[] | null,chId: string | string[] | null) : ChannelPubAsserter<T> {
        return new ChannelPubAsserter<T>(
            async (client,event,reaction) => {
                client.channelReact().oncePubCustomIdCh(chName,chId,event,reaction);
            }, this.clients,
            AbstractClientAsserter._buildCustomIdChName(chName,chId)
            ,this._test,this.self());
    }

    private static _buildCustomIdChName(chName: string | string[] | null,chId: string | string[] | null) : string {
        return (
            'CustomId channels with ' +
            (chName === null ? 'all channel names' : ('channel names: '+chName)) +
                ' and ' +
            (chId === null ? 'all ids' : ('ids: '+chId))
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
     * @param chName
     * You can also assert for multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     */
    getKickOutCustomCh(chName : string | string[] | null) : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutCustomCh(chName,reaction);
            }, this.clients,
            AbstractClientAsserter._buildCustomChName(chName)
            ,'KickOut',this._test,this.self());
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert is kicked out from custom id channel.
     * @param chName
     * You can also assert for multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also assert for multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     */
    getKickOutCustomIdCh(chName : string | string[] | null,chId: string | string[] | null) : ChannelEventAsserter<T> {
        return new ChannelEventAsserter<T>(
            async (client,reaction) => {
                client.channelReact().onceKickOutCustomIdCh(chName,chId,reaction);
            }, this.clients,
            AbstractClientAsserter._buildCustomIdChName(chName,chId)
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
     * @param chName
     * The custom channel name.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubCustomCh(chName : string,timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.hasSubCustomCh(chName)) {return;}
                const toa = new TimeoutAssert(`Client: ${i} should be subscribed the ${chName} custom channel.`,timeout);
                c.channelReact().onceSubCustomCh(chName,() => {toa.resolve()});
                await toa.set();
            });
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the client has subscribed an specific custom id channel.
     * @param chName
     * The custom id channel name.
     * @param chId
     * The custom id channel id.
     * @param timeout
     * With this parameter, you can set a time limit in that the assertion must be successful.
     */
    hasSubCustomIdCh(chName : string,chId : string,timeout : number = 0) : T {
        this._test.test(async () => {
            await this._forEachClient(async (c,i) => {
                if(c.hasSubCustomIdCh(chName,chId)) {return;}
                const toa = new TimeoutAssert
                (`Client: ${i} should be subscribed the ${chName} custom id channel with id: ${chId}.`,timeout);
                c.channelReact().onceSubCustomIdCh(chName,chId,() => {toa.resolve()});
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
}