/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractBackErrorsFilterBuilder, BackErrorFilter} from "zation-client";

export class BackErrorsFilterBuilder<T> extends AbstractBackErrorsFilterBuilder<BackErrorsFilterBuilder<T>> {

    private readonly _source: T;
    private readonly _filterCallback;

    constructor(source: T,filterCallback: (filter: BackErrorFilter) => void) {
        super();
        this._source = source;
        this._filterCallback = filterCallback;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Ends the filter builder.
     */
    end(): T {
        this._filterCallback(this.buildFilter() || {})
        return this._source;
    }

    protected self(): BackErrorsFilterBuilder<T> {
        return this;
    }

}