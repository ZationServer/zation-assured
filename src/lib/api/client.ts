/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ZationClient}             from 'zation-client';
import {StandaloneClientAsserter} from "../helper/asserter/standaloneClientAsserter";

export const client = (client : ZationClient | ZationClient[],testDescription ?: string) : StandaloneClientAsserter => {
    return new StandaloneClientAsserter(client, testDescription);
};

