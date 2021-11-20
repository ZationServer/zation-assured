/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Client} from 'zation-client';
import {AbstractClientAsserter} from "./abstractClientAsserter";
import {Test} from "../../test/test";

export class ClientAsserter<T,C extends Client<any, any>> extends AbstractClientAsserter<ClientAsserter<T,C>,C> {
    private readonly _source: T;

    constructor(clients: C[], test: Test, source: T) {
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

    protected self(): ClientAsserter<T,C> {
        return this;
    }
}