/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const cAssert                = require('chai').assert;

type AddTest = (test : (obj : any) => void) => void;

export default class ObjectAsserter<T> {

    protected readonly self : T;
    private readonly addTest : AddTest;
    private readonly name : string;

    constructor(self : T,name : string,addTest : AddTest) {
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
    containsAllKeys(...keys : string[]) : ObjectAsserter<T> {
        this.addTest((obj) => {
            cAssert.containsAllKeys(obj,keys,`${this.name} should contains ${keys} as keys.`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the object has at least one specific key or more.
     * @param keys
     */
    hasAnyKeys(...keys : string[]) : ObjectAsserter<T> {
        this.addTest((obj) => {
            cAssert.hasAnyKeys(obj,keys,`${this.name} should contains at least one of these keys: ${keys}.`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that the object is deepEqual with...
     * @param obj
     */
    deepEqual(obj : any) : ObjectAsserter<T> {
        this.addTest((inObj) => {
            // noinspection TypeScriptValidateJSTypes
            cAssert.deepEqual(inObj,obj,`${this.name} should deep equal with ${obj}`);
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
    ownInclude(obj : any) : ObjectAsserter<T>{
        this.addTest((inObj) => {
            // noinspection TypeScriptValidateJSTypes
            cAssert.ownInclude(inObj,obj,`${this.name} should own include ${obj}`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the object asserter.
     */
    end() : T {
        return this.self;
    }
}