/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Zation as ZationClient} from 'zation-client';
import {AbstractClientAsserter} from "./abstractClientAsserter";
import {Test} from "../data/test";

export class StandaloneClientAsserter extends AbstractClientAsserter<StandaloneClientAsserter>
{
    private static counter : number = 0;

    constructor(client : ZationClient | ZationClient[],testDescription : string = `When test number: ${StandaloneClientAsserter.counter}`) {
        let clients : ZationClient[] = Array.isArray(client) ? client : [client];
        StandaloneClientAsserter.counter++;
        super(clients,new Test(testDescription));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Run the test.
     */
    test() : void {
        this._test.execute();
    }

    protected self(): StandaloneClientAsserter {
        return this;
    }
}