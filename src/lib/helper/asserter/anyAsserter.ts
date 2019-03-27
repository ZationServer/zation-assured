/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


import ObjectAsserter          from "./objectAsserter";
const cAssert                = require('chai').assert;

type AddTest = (test : (any : any) => void) => void;

export class AnyAsserter<T> {

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
     * Assert that any is from a specific type.
     * @param type
     */
    typeOf(type : string) : AnyAsserter<T> {
        this.addTest((any) => {
            // noinspection TypeScriptValidateJSTypes
            cAssert.typeOf(any,type,`${this.name} should from type ${type}`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Assert that any is equal with...
     * @param any
     */
    equal(any : any) : AnyAsserter<T> {
        this.addTest((inAny) => {
            // noinspection TypeScriptValidateJSTypes
            cAssert.equal(inAny,any,`${this.name} should equal with ${any}`);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Object assert any.
     * This assertion will only invoked when any is from type object.
     * @param addTypeOfAssertion
     * Indicates if it should add a type of assertion for type object.
     * Default value is true.
     */
    objectAssert(addTypeOfAssertion : boolean = true) : ObjectAsserter<AnyAsserter<T>> {
        if(addTypeOfAssertion){
            this.typeOf('object');
        }
        return new ObjectAsserter(this,this.name,(test) => {
            this.addTest((any) => {
                if(typeof any === 'object'){test(any);}
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function you can create custom assertions for any.
     * @param assert
     * function with params
     * -any the input
     * -name the name of this assertion.
     */
    assert(assert : (any : any,name : string) => void | Promise<void>) : AnyAsserter<T> {
        this.addTest(async (inAny) => {
            await assert(inAny,this.name);
        });
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the any asserter.
     */
    end() : T {
        return this.self;
    }
}