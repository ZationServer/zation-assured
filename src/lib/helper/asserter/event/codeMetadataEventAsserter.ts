/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {ValueAsserter} from "../value/valueAsserter";
import {AbstractEventAsserter, EventOnceListenerAdder} from "./abstractEventAsserter";
import {Test} from "../../test/test";

export class CodeMetadataEventAsserter<S,A extends any[],CI extends keyof A,MDI extends keyof A>
    extends AbstractEventAsserter<CodeMetadataEventAsserter<S,A,CI,MDI>,S,A> {

    constructor(eventOnceListenerAdder: EventOnceListenerAdder<A>[], target: string, event: string,
                test: Test, source: S, private readonly codeIndex: CI,
                private readonly metadataIndex: MDI, messagePostfix: string = "")
    {
        super(eventOnceListenerAdder,target,event,test,source,messagePostfix)
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the code of the event.
     * Notice that the code will not be checked in (get not) mode.
     */
    withCode(): ValueAsserter<A[CI],CodeMetadataEventAsserter<S,A,CI,MDI>> {
        return new ValueAsserter<A[CI],CodeMetadataEventAsserter<S,A,CI,MDI>>(this.self(),(test) => {
            this._argsAsserter.push((args,target) => {
                test(args[this.codeIndex],target + 'code');
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Asserts the metadata of the event.
     * Notice that the metadata will not be checked in (get not) mode.
     */
    withMetadata(): ValueAsserter<A[MDI],CodeMetadataEventAsserter<S,A,CI,MDI>> {
        return new ValueAsserter<A[MDI],CodeMetadataEventAsserter<S,A,CI,MDI>>(this.self(), (test) => {
            this._argsAsserter.push((args,target) => {
                test(args[this.metadataIndex],target + 'metadata');
            });
        });
    }

    protected self(): CodeMetadataEventAsserter<S,A,CI,MDI> {
        return this;
    }
}