/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Zation as ZationClient} from 'zation-client';
import {AbstractClientAsserter} from "./abstractClientAsserter";
import {Test} from "../data/test";

export class ClientAsserter<T> extends AbstractClientAsserter<ClientAsserter<T>>
{
    private readonly source : T;

    constructor(clients : ZationClient[],test : Test,source : T) {
        super(clients,test);
        this.source = source;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the client asserter.
     */
    end() : T {
        return this.source;
    }

    protected self(): ClientAsserter<T> {
        return this;
    }
}