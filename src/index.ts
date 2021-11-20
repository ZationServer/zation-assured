/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

//Api Classes
import {ClientOptions, Client, create} from "zation-client";
import {when} from "./lib/api/when";

import {
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
    fail,
    Client
};