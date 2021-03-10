/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Client} from 'zation-client';
import {AbstractClientAsserter} from "./abstractClientAsserter";
import {Test} from "../../test/test";

export class ClientAsserter<T> extends AbstractClientAsserter<ClientAsserter<T>> {
    private readonly _source: T;

    constructor(clients: Client[], test: Test, source: T) {
        super(clients, test);
        this._source = source;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the client asserter.
     */
    end(): T {
        return this._source;
    }

    protected self(): ClientAsserter<T> {
        return this;
    }
}