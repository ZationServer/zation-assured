/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import {create,load,save,Options as ClientOptions,ZationClient} from "zation-client";
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

export {
    create,
    ClientOptions,
    load,
    save,
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





