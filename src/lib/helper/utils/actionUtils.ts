/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {fail,AssertionError} from "assert";

export default class ActionUtils {

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Runs a test action and asserts that no error will be thrown.
     * AssertionErrors will be rethrown, and all other errors will fail
     * the test with the provided message or the concrete error.
     * @param func
     * @param failMsg If not provided, the concrete error is used.
     */
    static async runAction(func: () => void | Promise<void>, failMsg ?: string) {
        try {await func();}
        catch (err: any) {
            if(err instanceof AssertionError) throw err;
            fail(failMsg != null ? failMsg : err);
        }
    }
}


