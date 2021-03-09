/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {
    PackageBuilder as NativePackageBuilder,
    ZationClient,
}
    from "zation-client";
import {Test} from "../../test/test";
import {RootSendAsserter} from "../rootSendAsserter";

export class TransmitAsserter extends RootSendAsserter<TransmitAsserter> {

    private nativeBuilder: NativePackageBuilder<any>;

    constructor(nativeBuilder: NativePackageBuilder<any>, test: Test, client: ZationClient) {
        super(test,client)
        this.nativeBuilder = nativeBuilder;
    }

    protected async _executeAction(): Promise<void> {
        await this.nativeBuilder.send()
    }

    protected self(): TransmitAsserter {
        return this;
    }
}