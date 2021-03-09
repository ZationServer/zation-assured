/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import forint, {ForintQuery} from "forint";
import {assert as cAssert} from 'chai';

type AddTest = (test: (value: any, eStr ?: string) => void) => void;

export abstract class AbstractValueAsserter<T> {

    protected abstract self(): T;

    private readonly addTest: AddTest;
    private readonly name: string;

    protected constructor(name: string, addTest: AddTest) {
        this.addTest = addTest;
        this.name = name;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is undefined.
     */
    isUndefined(): T {
        this.addTest((value, eStr = '') => {
            cAssert(value === undefined,
                `${this.name + eStr} should be undefined.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the type of the value.
     * @param type
     */
    typeOf(type: 'string' | 'boolean' | 'number' | 'undefined'
        | 'object' | 'array' | 'function' | 'symbol' | 'bigint' | string): T {
        this.addTest((value, eStr = '') => {
            cAssert.typeOf(value, type,
                `${this.name + eStr} should be type of ${type}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is content equal (==).
     * @param expectedValue
     */
    contentEqual(expectedValue: any): T {
        this.addTest((value, eStr = '') => {
            cAssert.equal(value, expectedValue,
                `${this.name + eStr} should be content equal with ${expectedValue}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is strict equal (===).
     * @param expectedValue
     */
    equal(expectedValue: any): T {
        this.addTest((value, eStr = '') => {
            cAssert.strictEqual(value, expectedValue,
                `${this.name + eStr} should be strict equal with ${expectedValue}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is deep content equal.
     * @param expectedValue
     */
    deepContentEqual(expectedValue: any): T {
        this.addTest((value, eStr = '') => {
            cAssert.deepEqual(value, expectedValue,
                `${this.name + eStr} should be deep content equal with ${JSON.stringify(expectedValue)}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is deep strict equal.
     * @param expectedValue
     */
    deepEqual(expectedValue: any): T {
        this.addTest((value, eStr = '') => {
            cAssert.deepStrictEqual(value, expectedValue,
                `${this.name + eStr} should be deep strict equal with ${JSON.stringify(expectedValue)}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts that the value matches with a forint query.
     */
    matches(query: ForintQuery): T {
        this.addTest(async (inAny, eStr = '') => {
            await cAssert(forint(query)(inAny),
                `${this.name + eStr} should match with the forint query.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value has all specific keys.
     * @param keys
     */
    containsAllKeys(...keys: string[]): T {
        this.addTest((value, eStr = '') => {
            cAssert.containsAllKeys(value, keys,
                `${this.name + eStr} should contain all following keys: ${keys}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value has at least one specific keys.
     * @param keys
     */
    hasAnyKeys(...keys: string[]): T {
        this.addTest((value, eStr = '') => {
            cAssert.hasAnyKeys(value, keys,
                `${this.name + eStr} should contain at least one of these keys: ${keys}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value should own include a subset.
     * @example
     * ownInclude({id: 10});
     * @param subset
     */
    ownInclude(subset: Record<string,any>): T {
        this.addTest((value, eStr = '') => {
            cAssert.ownInclude(value, subset,
                `${this.name + eStr} should own include ${JSON.stringify(subset)}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value should include a subset.
     * @example
     * [1,2,3] - 2
     * 'foobar' - 'foo'
     * @param subset
     */
    include(subset: any): T {
        this.addTest((value, eStr = '') => {
            cAssert.include(value, subset,
                `${this.name + eStr} should include ${JSON.stringify(subset)}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Lets you do a custom assertion with the value.
     * @param assert
     * @param message
     */
    assert(assert: (value: any) => boolean | Promise<boolean>,
           message: string = 'Custom assertion should return true.'): T
    {
        this.addTest(async (value, eStr = '') => {
            cAssert(await assert(value),
                `${this.name + eStr}: ${message}`);
        });
        return this.self();
    }
}