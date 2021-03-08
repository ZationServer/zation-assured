/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import assertFunc = require('assert');
import {StandaloneClientAsserter} from "../helper/asserter/standaloneClientAsserter";
import {ZationClient} from "zation-client";
import forint, {ForintQuery} from "forint";

export const assert: {
    /**
     * Asserts that the value is true.
     * @param value
     * @param message
     */
    (value: any,message?: string | Error): void,
    /**
     * Start client assertions.
     * @param client
     * @param itTestDescription
     */
    client: (client: ZationClient | ZationClient[], itTestDescription?: string) => StandaloneClientAsserter,
    /**
     * Asserts that the value is deep equal.
     * @param actual
     * @param expect
     * @param message
     */
    deepEqual: (actual: any, expect: any,message?: string | Error) => void,
    /**
     * Asserts that the value is not deep equal.
     * @param actual
     * @param expect
     * @param message
     */
    notDeepEqual: (actual: any, expect: any,message?: string | Error) => void,
    /**
     * Asserts that the promise rejects an error that matches with the forint query.
     * @param promise
     * @param query
     * @param message
     */
    rejects: (promise: Promise<any>,query: ForintQuery,message?: string | Error) => Promise<void>,
    /**
     * Asserts that the promise resolves with a result that matches with the forint query.
     * @param promise
     * @param query
     * @param message
     */
    resolves: (promise: Promise<any>,query: ForintQuery,message?: string | Error) => Promise<void>
    /**
     * Lets the test failing.
     * @param message
     */
    fail: (message?: string | Error) => void
} = ((value,message) => {
    assertFunc(value,message);
}) as any;

assert.client = (client, itTestDescription) => {
    return new StandaloneClientAsserter(client, itTestDescription);
}
assert.deepEqual = (actual, expect, message) => {
    assertFunc.deepStrictEqual(actual,expect,message);
}
assert.notDeepEqual = (actual, expect, message) => {
    assertFunc.notDeepStrictEqual(actual,expect,message);
}
assert.rejects = (promise, query, message) => {
    return new Promise<void>(r => {
        promise.then(() => {
            assertFunc.fail(message);
            r();
        },(err) => {
            assert(forint(query)(err),message);
            r();
        })
    })
}
assert.resolves = (promise, query, message) => {
    return new Promise<void>(r => {
        promise.then((res) => {
            assert(forint(query)(res),message);
            r();
        },() => {
            assertFunc.fail(message);
            r();
        })
    })
}
assert.fail = (message) => {
    assertFunc.fail(message);
}