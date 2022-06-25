/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractEventAsserter, EventOnceListenerAdder} from "./abstractEventAsserter";
import {Test} from "../../test/test";
import {ValueAsserter} from "../value/valueAsserter";

export class DataEventAsserter<S,A extends any[],DI extends keyof A> extends AbstractEventAsserter<DataEventAsserter<S,A,DI>,S,A>{

    constructor(eventOnceListenerAdder: EventOnceListenerAdder<A>[], target: string, event: string,
                test: Test, source: S, private readonly dataIndex: DI, messagePostfix: string = "")
    {
        super(eventOnceListenerAdder,target,event,test,source,messagePostfix)
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the data of the event.
     * Notice that the data will not be checked in (get not) mode.
     */
    withData(): ValueAsserter<A[DI],DataEventAsserter<S,A,DI>> {
        return new ValueAsserter<A[DI],DataEventAsserter<S,A,DI>>(this.self(), (test) => {
            this._argsAsserter.push((args,target) => {
                test(args[this.dataIndex],target + 'data');
            });
        });
    }


    protected self(): DataEventAsserter<S,A,DI> {
        return this;
    }
}