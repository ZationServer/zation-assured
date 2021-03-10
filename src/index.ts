/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import {ClientOptions, Client, create} from "zation-client";
import {when} from "./lib/api/when";

import {
    beforeTest as before,
    afterTest as after,
    afterEachTest as afterEach,
    beforeEachTest as beforeEach,
    describeTest as describe,
    itTest as it,
    failTest as fail
}
    from "./lib/api/testHelper";
import {assert} from "./lib/api/assert";

export * from 'zation-client';
export {
    create as createClient,
    ClientOptions,
    when,
    assert,
    describe,
    before,
    after,
    beforeEach,
    afterEach,
    it,
    fail,
    Client
};