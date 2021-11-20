/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {
    Client
} from "zation-client";
import {Test} from "../../test/test";
import {AbstractActionAsserter} from "../abstractActionAsserter";

export class IntegratedTransmitAsserter<C extends Client<any,any>> extends AbstractActionAsserter<IntegratedTransmitAsserter<C>,C> {

    constructor(private readonly transmit: () => Promise<void>, test: Test, client: C) {
        super(test,client);
    }

    protected async _executeAction(): Promise<void> {
        await this.transmit();
    }

    protected self(): IntegratedTransmitAsserter<C> {
        return this;
    }
}