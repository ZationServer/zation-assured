/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Logger} from "../helper/console/logger";
import {fail} from "assert";
const assert  = require('assert');

type Func = () => Promise<void> | void;

export const beforeTest = (beforeTest: Func) => {
    firstInit();
    before(async function() {
        this.timeout(10000);
        await beforeTest();
    });
};

export const afterTest = (afterTest: Func) => {
    after(async function() {
        this.timeout(5000);
        await afterTest();
    });
};

export const beforeEachTest = (beforeEachTest: Func) => {
    firstInit();
    beforeEach(async function() {
        this.timeout(10000);
        await beforeEachTest;
    });
};

export const afterEachTest = (afterEachTest: Func) => {
    afterEach(async function() {
        this.timeout(10000);
        await afterEachTest;
    });
};

export const describeTest = (title: string, area: Func) => {
    firstInit();
    describe(title, async () => {
        await area();
    });
};

export const itTest = (title: string, area: Func) => {
    firstInit();
    it(title, async () => {
        await area();
    });
};

export const failTest = (msg: string, actual ?: any, expected ?: any) => {
    if(actual !== undefined || expected !== undefined)
    {assert.fail(actual,expected,msg);}
    else {assert.fail(msg);}
};

let firstCall = true;
const firstInit = () => {
    if (firstCall) {
        firstCall = false;
        Logger.logBusy('Run Tests');
    }
};