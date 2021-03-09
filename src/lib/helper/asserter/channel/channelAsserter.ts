/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Channel} from 'zation-client';
import {Test} from "../../test/test";
import {AbstractChannelAsserter} from "./abstractChannelAsserter";

export class ChannelAsserter<T> extends AbstractChannelAsserter<ChannelAsserter<T>> {

    private readonly _source: T;

    constructor(channels: Channel[], test: Test, source: T) {
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

    protected self(): ChannelAsserter<T> {
        return this;
    }
}