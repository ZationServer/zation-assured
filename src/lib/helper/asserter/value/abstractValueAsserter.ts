/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import forint, {ForintQuery} from "forint";
import {assert as cAssert} from 'chai';

type AddTest = (test: (value: any, target: string) => void) => void;

export abstract class AbstractValueAsserter<V,T> {

    protected abstract self(): T;

    private readonly addTest: AddTest;

    protected constructor(addTest: AddTest) {
        this.addTest = addTest;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is undefined.
     */
    isUndefined(): T {
        this.addTest((value, target) => {
            cAssert(value === undefined,
                `${target} should be undefined.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is not undefined.
     */
    isNotUndefined(): T {
        this.addTest((value, target) => {
            cAssert(value !== undefined,
                `${target} should be not undefined.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the type of the value matches.
     * @param type
     */
    typeOf(type: 'string' | 'boolean' | 'number' | 'undefined'
        | 'object' | 'array' | 'function' | 'symbol' | 'bigint' | string): T {
        this.addTest((value, target) => {
            cAssert.typeOf(value, type,
                `${target} should be type of ${type}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the type of the value not matches.
     * @param type
     */
    notTypeOf(type: 'string' | 'boolean' | 'number' | 'undefined'
        | 'object' | 'array' | 'function' | 'symbol' | 'bigint' | string): T {
        this.addTest((value, target) => {
            cAssert.notTypeOf(value, type,
                `${target} should be not type of ${type}`);
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
        this.addTest((value, target) => {
            cAssert.equal(value, expectedValue,
                `${target} should be content equal with ${expectedValue}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is not content equal (==).
     * @param expectedValue
     */
    notContentEqual(expectedValue: any): T {
        this.addTest((value, target) => {
            cAssert.notEqual(value, expectedValue,
                `${target} should be not content equal with ${expectedValue}`);
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
        this.addTest((value, target) => {
            cAssert.strictEqual(value, expectedValue,
                `${target} should be strict equal with ${expectedValue}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is not strict equal (===).
     * @param expectedValue
     */
    notEqual(expectedValue: any): T {
        this.addTest((value, target) => {
            cAssert.notStrictEqual(value, expectedValue,
                `${target} should be not strict equal with ${expectedValue}`);
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
        this.addTest((value, target) => {
            cAssert.deepEqual(value, expectedValue,
                `${target} should be deep strict equal with ${JSON.stringify(expectedValue)}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value is not deep strict equal.
     * @param expectedValue
     */
    notDeepEqual(expectedValue: any): T {
        this.addTest((value, target) => {
            cAssert.notDeepEqual(value, expectedValue,
                `${target} should be not deep strict equal with ${JSON.stringify(expectedValue)}`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts that the value matches with a forint query.
     */
    matches(query: ForintQuery<V> | ForintQuery<Record<any,any>>): T {
        this.addTest(async (inAny, target) => {
            await cAssert(forint(query)(inAny),
                `${target} should match with the forint query.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Asserts that the value not matches with a forint query.
     */
    notMatches(query: ForintQuery<V> | ForintQuery<Record<any,any>>): T {
        this.addTest(async (inAny, target) => {
            await cAssert(!forint(query)(inAny),
                `${target} should not match with the forint query.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value has all specific keys.
     * @param keys
     */
    containsAllKeys(...keys: (keyof V | string)[]): T {
        this.addTest((value, target) => {
            cAssert.containsAllKeys(value, keys,
                `${target} should contain all following keys: ${keys}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value has at least one specific keys.
     * @param keys
     */
    hasAnyKeys(...keys: (keyof V | string)[]): T {
        this.addTest((value, target) => {
            cAssert.hasAnyKeys(value, keys,
                `${target} should contain at least one of these keys: ${keys}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value does not have any of the specific keys.
     * @param keys
     */
    doesNotHaveAnyKeys(...keys: (keyof V | string)[]): T {
        this.addTest((value, target) => {
            cAssert.doesNotHaveAnyKeys(value, keys,
                `${target} should not contain any of these keys: ${keys}.`);
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
        this.addTest((value, target) => {
            cAssert.ownInclude(value, subset,
                `${target} should own include ${JSON.stringify(subset)}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value should not own include a subset.
     * @example
     * notOwnInclude({id: 10});
     * @param subset
     */
    notOwnInclude(subset: Record<string,any>): T {
        this.addTest((value, target) => {
            cAssert.notOwnInclude(value, subset,
                `${target} should not own include ${JSON.stringify(subset)}.`);
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
        this.addTest((value, target) => {
            cAssert.include(value, subset,
                `${target} should include ${JSON.stringify(subset)}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value should not include a subset.
     * @example
     * [1,2,3] - 2
     * 'foobar' - 'foo'
     * @param subset
     */
    notInclude(subset: any): T {
        this.addTest((value, target) => {
            cAssert.notInclude(value, subset,
                `${target} should not include ${JSON.stringify(subset)}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts that the value should have a specific length.
     * @param length
     */
    lengthOf(length: number): T {
        this.addTest((value, target) => {
            cAssert.lengthOf(value, length,
                `${target} should have a length of ${length}.`);
        });
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a custom assertion.
     * @param assert
     */
    assert(assert: (value: any, target: string) => void | Promise<void>): T {
        this.addTest((value, target) => assert(value,target));
        return this.self();
    }
}