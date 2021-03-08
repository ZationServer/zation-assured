/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import forint, {ForintQuery} from "forint";
const cAssert = require('chai').assert;

type AddTest = (test: (obj: any, eStr ?: string) => void) => void;

export default class ObjectAsserter<T> {

    protected readonly self: T;
    private readonly addTest: AddTest;
    private readonly name: string;

    constructor(self: T, name: string, addTest: AddTest) {
        this.self = self;
        this.addTest = addTest;
        this.name = name;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the object has all specific keys or more.
     * @param keys
     */
    containsAllKeys(...keys: string[]): ObjectAsserter<T> {
        this.addTest((obj, eStr = '') => {
            cAssert.containsAllKeys(obj, keys, `${this.name + eStr} should contains ${keys} as keys.`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the object has at least one specific key or more.
     * @param keys
     */
    hasAnyKeys(...keys: string[]): ObjectAsserter<T> {
        this.addTest((obj, eStr = '') => {
            cAssert.hasAnyKeys(obj, keys, `${this.name + eStr} should contains at least one of these keys: ${keys}.`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the object is deepEqual with...
     * @param obj
     */
    deepEqual(obj: any): ObjectAsserter<T> {
        this.addTest((inObj, eStr = '') => {
            // noinspection TypeScriptValidateJSTypes
            cAssert.deepEqual(inObj, obj, `${this.name + eStr} should deep equal with ${JSON.stringify(obj)}`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the object own includes...
     * Can be used to assert the inclusion of a subset of properties
     * in an object while ignoring inherited properties.
     * @example
     * ownInclude({id : 10});
     * @param obj
     */
    ownInclude(obj: any): ObjectAsserter<T> {
        this.addTest((inObj, eStr = '') => {
            // noinspection TypeScriptValidateJSTypes
            cAssert.ownInclude(inObj, obj, `${this.name + eStr} should own include ${JSON.stringify(obj)}`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts that object matches with a forint query.
     */
    matches(query: ForintQuery): ObjectAsserter<T> {
        this.addTest(async (inObj, eStr = '') => {
            await cAssert(forint(query)(inObj), `${this.name + eStr} should match with the forint query.`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function you can create custom assertions for object.
     * @param assert
     * function with params
     * -obj the input
     * -name the name of this assertion.
     */
    assert(assert: (obj: any, name: string) => void | Promise<void>): ObjectAsserter<T> {
        this.addTest(async (inObj, eStr = '') => {
            await assert(inObj, (this.name + eStr));
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the object asserter.
     */
    end(): T {
        return this.self;
    }
}