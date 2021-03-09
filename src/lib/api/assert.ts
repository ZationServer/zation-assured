/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import assertFunc = require('assert');
import {StandaloneClientAsserter} from "../helper/asserter/client/standaloneClientAsserter";
import {Channel, Databox, ZationClient} from "zation-client";
import forint, {ForintQuery} from "forint";
import {StandaloneDataboxAsserter} from "../helper/asserter/databox/standaloneDataboxAsserter";
import {StandaloneChannelAsserter} from "../helper/asserter/channel/standaloneChannelAsserter";
import {StandaloneValueAsserter} from "../helper/asserter/value/standaloneValueAsserter";

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
     * @param itTestDescription
     */
    value: (value: any, itTestDescription?: string) => StandaloneValueAsserter,
    /**
     * Start client assertions.
     * Notice that this method will not automatically connect the clients.
     * @param client
     * @param itTestDescription
     */
    client: (client: ZationClient | ZationClient[], itTestDescription?: string) => StandaloneClientAsserter,
    /**
     * Start databox assertions.
     * Notice that this method will not automatically connect the databoxes.
     * @param databox
     * @param itTestDescription
     */
    databox: (databox: Databox | Databox[], itTestDescription?: string) => StandaloneDataboxAsserter,
    /**
     * Start channel assertions.
     * Notice that this method will not automatically subscribe to the channels.
     * @param channel
     * @param itTestDescription
     */
    channel: (channel: Channel | Channel[], itTestDescription?: string) => StandaloneChannelAsserter,
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

assert.value = (value, itTestDescription) => {
    return new StandaloneValueAsserter(value, itTestDescription);
}
assert.client = (client, itTestDescription) => {
    return new StandaloneClientAsserter(client, itTestDescription);
}
assert.databox = (databox, itTestDescription) => {
    return new StandaloneDataboxAsserter(databox, itTestDescription);
}
assert.channel = (channel, itTestDescription) => {
    return new StandaloneChannelAsserter(channel, itTestDescription);
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