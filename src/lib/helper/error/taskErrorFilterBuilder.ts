/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


import {AbstractErrorFilterBuilder} from "zation-client";
// noinspection TypeScriptPreferShortImport
import {ResponseAsserter}           from "./../asserter/responseAsserter";

export class TaskErrorFilterBuilder<T extends ResponseAsserter> extends AbstractErrorFilterBuilder<TaskErrorFilterBuilder<T>>
{
    private readonly respAsserter  : T;
    private readonly count : number | undefined;

    constructor(respAsserter : T,count ?: number) {
        super();
        this.respAsserter = respAsserter;
        this.count = count;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * End the filter builder.
     */
    end() : T
    {
        this._pushTmpFilter();
        if(this.count){
            this.respAsserter.hasErrorCount(this.count,...this.filter);
        }
        else {
            this.respAsserter.hasError(...this.filter);
        }
        return this.respAsserter;
    }

    protected self() : TaskErrorFilterBuilder<T> {
        return this;
    }

}