/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import {Options as ClientOptions,ZationClient}     from "zation-client";
import {when}                                      from "./lib/api/when";
import {client}                                    from "./lib/api/client";

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
import {ClientUtils} from "./lib/helper/utils/clientUtils";
const forEachClient = ClientUtils.forEachClient;

export * from  'zation-client';
export {
    ClientOptions,
    when,
    client,
    describe,
    before,
    after,
    beforeEach,
    afterEach,
    it,
    fail,
    ZationClient,
    forEachClient
};





