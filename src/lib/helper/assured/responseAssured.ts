/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractRequestHelper, Zation as ZationClient,Response} from "zation-client";
import {Test}                  from "../data/test";
import {WhenBuilder}           from "../../api/when";
import {Logger} from "../console/logger";
const assert                 = require('assert');

export class ResponseAssured {

    private req : AbstractRequestHelper<any>;
    private readonly _test : Test;
    private readonly client : ZationClient;

    constructor(req : AbstractRequestHelper<any>,test : Test,client : ZationClient) {
        this.req = req;
        this._test = test;
        this.client = client;

        this._test.test(async () => {
           await this.req.send(false);
        });
    }

    // noinspection JSMethodCanBeStatic
    private _respInfo(res : Response) {
        return '\n   ' + res.toString();
    }

    isSuccessful() : ResponseAssured {
        this.req.onResponse((res) => {
            assert(res.isSuccessful(),'Response should be successful.'+ this._respInfo(res));
        });
        return this;
    }

    notSuccessful() : ResponseAssured {
        this.req.onResponse((res) => {
            assert(!res.isSuccessful(),'Response should be not successful.' + this._respInfo(res));
        });
        return this;
    }

    hasError() : ResponseAssured {
        this.req.onResponse((res) => {
            assert(res.hasErrors(false),'Response should have at least one error.' + this._respInfo(res));
        });
        return this;
    }

    print() : ResponseAssured {
        this.req.onResponse((res) => {
            Logger.logInfo(res.toString());
        });
        return this;
    }

    hasErrorCount(count : number) : ResponseAssured {
        this.req.onResponse((res) => {
            assert(res.getErrors(false).length === count,
                `Response should have ${count} errors.` + this._respInfo(res));
        });
        return this;
    }

    and() : WhenBuilder {
        return new WhenBuilder(this.client,this._test);
    }

    test() : void {
        this._test.execute();
    }

}