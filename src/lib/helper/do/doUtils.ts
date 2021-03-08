/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../test/test";

const assert = require('assert');

export default class DoUtils {

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test.
     * It asserts that the do-function will not throw an error.
     * Subscribe a channel, publish to a channel...
     * @param test
     * @param func
     * @param failMsg if not provided it throws the specific error.
     */
    static do(test: Test, func: () => void | Promise<void>, failMsg ?: string): void {
        test.test(async () => {
            try {
                await func();
            } catch (e) {
                if (failMsg !== undefined) {
                    assert.fail(failMsg);
                } else {
                    throw e;
                }
            }
        }, true);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * With this function, you can do extra things in the test
     * and assert that it should throw an error or a specific error.
     * Subscribe a channel, publish to a channel...
     * @param test
     * @param func
     * @param failMsg
     * @param errors
     */
    static doShouldThrow(test: Test, func: () => void | Promise<void>, failMsg: string, ...errors: any[]): void {
        test.test(async () => {
            let throws = false;
            try {
                await func();
            } catch (e) {
                throws = true;
                let found = errors.length === 0;
                for (let i = 0; i < errors.length; i++) {
                    if (e instanceof errors[i]) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    assert.fail(failMsg);
                }
            }
            if (!throws) {
                assert.fail(failMsg);
            }
        }, true);
    }
}


