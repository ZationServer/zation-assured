/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import assertFunc = require('assert');
import {StandaloneClientAsserter} from "../helper/asserter/client/standaloneClientAsserter";
import {Channel, Databox, Client, Response} from "zation-client";
import forint, {ForintQuery} from "forint";
import {StandaloneDataboxAsserter} from "../helper/asserter/databox/standaloneDataboxAsserter";
import {StandaloneChannelAsserter} from "../helper/asserter/channel/standaloneChannelAsserter";
import {StandaloneValueAsserter} from "../helper/asserter/value/standaloneValueAsserter";
import StandaloneResponseAsserter from "../helper/asserter/controller/standaloneResponseAsserter";

export const assert: {
    /**
     * Asserts that the value is true.
     * @param value
     * @param message
     */
    (value: any, message?: string | Error): void,
    /**
     * Start value assertions.
     * @param client
     * @param description
     */
    value: <V>(value: V, description?: string) => StandaloneValueAsserter<V>,
    /**
     * Start response assertions.
     * @param response
     * @param description
     */
    response: <R extends Response<any>>(response: R | R[], description?: string) => StandaloneResponseAsserter<R>,
    /**
     * Start client assertions.
     * Notice that this method will not automatically connect the clients.
     * @param client
     * @param description
     */
    client: <C extends Client<any,any>>(client: C | C[], description?: string) => StandaloneClientAsserter<C>,
    /**
     * Start databox assertions.
     * Notice that this method will not automatically connect the databoxes.
     * @param databox
     * @param description
     */
    databox: <D extends Databox<any,any,any,any>>(databox: D | D[], description?: string) => StandaloneDataboxAsserter<D>,
    /**
     * Start channel assertions.
     * Notice that this method will not automatically subscribe to the channels.
     * @param channel
     * @param description
     */
    channel: <C extends Channel<any,any>>(channel: C | C[], description?: string) => StandaloneChannelAsserter<C>,
    /**
     * Asserts that the promise rejects an error that matches with the forint query.
     * @param promise
     * @param query
     * @param message
     */
    rejects: (promise: Promise<any>, query: ForintQuery, message?: string | Error) => Promise<void>,
    /**
     * Asserts that the promise resolves with a result that matches with the forint query.
     * @param promise
     * @param query
     * @param message
     */
    resolves: (promise: Promise<any>, query: ForintQuery, message?: string | Error) => Promise<void>
    /**
     * Lets the test failing.
     * @param message
     */
    fail: (message?: string | Error) => void
} = ((value, message) => {
    assertFunc(value, message);
}) as any;

assert.value = (value, description) => {
    return new StandaloneValueAsserter(value, description);
}
assert.response = (response, description) => {
    return new StandaloneResponseAsserter(response, description);
}
assert.client = (client, description) => {
    return new StandaloneClientAsserter(client, description);
}
assert.databox = (databox, description) => {
    return new StandaloneDataboxAsserter(databox, description);
}
assert.channel = (channel, description) => {
    return new StandaloneChannelAsserter(channel, description);
}
assert.rejects = (promise, query, message) => {
    return new Promise<void>(r => {
        promise.then(() => {
            assertFunc.fail(message);
            r();
        }, (err) => {
            assert(forint(query)(err), message);
            r();
        })
    })
}
assert.resolves = (promise, query, message) => {
    return new Promise<void>(r => {
        promise.then((res) => {
            assert(forint(query)(res), message);
            r();
        }, () => {
            assertFunc.fail(message);
            r();
        })
    })
}
assert.fail = (message) => {
    assertFunc.fail(message);
}