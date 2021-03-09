/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Test} from "../test/test";

const assert = require('assert');

export default class ActionUtils {

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function lets you do an extra action and asserts that no error is thrown.
     * When an error throws, it lets the test fail with the provided message or the concrete error.
     * @param test
     * @param func
     * @param failMsg if not provided it throws the specific error.
     */
    static action(test: Test, func: () => void | Promise<void>, failMsg ?: string): void {
        test.test(async () => {
            try {
                await func();
            } catch (e) {
                assert.fail(failMsg !== undefined ? failMsg : e);
            }
        }, true);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This function lets you do an extra action and
     * asserts that an error or an error instance of a specific class is thrown.
     * When no error is thrown, or the error does not match with the given classes
     * (only if at least one class is given), it lets the test fail with the provided message.
     * @param test
     * @param func
     * @param message
     * @param validErrorClasses
     */
    static actionShouldThrow(test: Test, func: () => void | Promise<void>, message: string, ...validErrorClasses: any[]): void {
        test.test(async () => {
            try {
                await func();
                assert.fail(message);
            } catch (e) {
                let found = validErrorClasses.length === 0;
                for (let i = 0; i < validErrorClasses.length; i++) {
                    if (e instanceof validErrorClasses[i]) {
                        found = true;
                        break;
                    }
                }
                if (!found) assert.fail(message);
            }
        }, true);
    }
}


