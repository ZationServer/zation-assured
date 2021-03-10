/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {PackageBuilder as NativePackageBuilder, Client} from "zation-client";
import {Test} from "../../test/test";
import {ConnectTimeoutOption} from "zation-client/dist/lib/main/utils/connectionUtils";
import {TransmitAsserter} from "../../asserter/receiver/transmitAsserter";

export class PackageBuilder {

    private readonly test: Test;
    private readonly client: Client;
    private readonly natveBuilder: NativePackageBuilder<any>;

    constructor(nativeBuilder: NativePackageBuilder<any>, test: Test, client: Client) {
        this.test = test;
        this.client = client;
        this.natveBuilder = nativeBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the data of the package.
     * @param data
     * @default undefined
     */
    data(data: any): PackageBuilder {
        this.natveBuilder.data(data);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the apiLevel of the package.
     * @param apiLevel.
     * @default undefined.
     */
    apiLevel(apiLevel: number | undefined): PackageBuilder {
        this.natveBuilder.apiLevel(apiLevel);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @param timeout
     * @default undefined
     */
    connectTimeout(timeout: ConnectTimeoutOption): PackageBuilder {
        this.natveBuilder.connectTimeout(timeout);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start the assertions.
     */
    assertThat(): TransmitAsserter {
        return new TransmitAsserter(this.natveBuilder, this.test, this.client);
    }
}