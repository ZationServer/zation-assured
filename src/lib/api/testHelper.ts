/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Logger} from "../helper/console/logger";
const assert  = require('assert');

type Func = () => Promise<void> | void;

export const beforeTest = (beforeTest: Func,timeout : number = 10000) => {
    firstInit();
    before(async function() {
        this.timeout(timeout);
        await beforeTest();
    });
};

export const afterTest = (afterTest: Func,timeout : number = 10000) => {
    after(async function() {
        this.timeout(timeout);
        await afterTest();
    });
};

export const beforeEachTest = (beforeEachTest: Func,timeout : number = 10000) => {
    firstInit();
    beforeEach(async function() {
        this.timeout(timeout);
        await beforeEachTest;
    });
};

export const afterEachTest = (afterEachTest: Func,timeout : number = 10000) => {
    afterEach(async function() {
        this.timeout(timeout);
        await afterEachTest;
    });
};

export const describeTest = (title: string, area: Func,timeout : number = 10000) => {
    firstInit();
    describe(title, async function() {
        this.timeout(timeout);
        await area();
    });
};

export const itTest = (title: string, area: Func,timeout : number = 10000) => {
    firstInit();
    it(title, async function() {
        this.timeout(timeout);
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