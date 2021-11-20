/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {Channel} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractChannelAsserter} from "./abstractChannelAsserter";

export class ChannelAsserter<T,C extends Channel<any,any>> extends AbstractChannelAsserter<ChannelAsserter<T,C>,C> {

    private readonly _source: T;

    constructor(channels: C[], test: Test, source: T) {
        super(channels, test);
        this._source = source;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the channel asserter.
     */
    end(): T {
        return this._source;
    }

    protected self(): ChannelAsserter<T,C> {
        return this;
    }
}