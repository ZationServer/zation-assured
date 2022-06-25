/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

const assert = require('assert');

export const failTest = function(msg: string, actual ?: any, expected ?: any) {
    if (arguments.length > 1) assert.fail(actual, expected, msg);
    else assert.fail(msg);
};