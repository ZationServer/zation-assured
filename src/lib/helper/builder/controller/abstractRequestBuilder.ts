/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {AbstractRequestBuilder as NativeAbstractRequestBuilder, Client} from "zation-client";
import {Test} from "../../test/test";
import {ResponseAsserter} from "../../asserter/controller/responseAsserter";
import {ConnectTimeoutOption} from "zation-client/dist/lib/main/utils/connectionUtils";

export abstract class AbstractRequestBuilder<T, RT> {

    private readonly test: Test;
    private readonly client: Client;
    private readonly nativeBuilder: NativeAbstractRequestBuilder<any>;

    protected constructor(test: Test, client: Client, nativeBuilder: NativeAbstractRequestBuilder<any>) {
        this.test = test;
        this.client = client;
        this.nativeBuilder = nativeBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the apiLevel of the request.
     * @param apiLevel.
     * @default undefined.
     */
    apiLevel(apiLevel: number | undefined): T {
        this.nativeBuilder.apiLevel(apiLevel);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the client config,
     * or it can be a number that indicates the milliseconds.
     * @param timeout
     */
    responseTimeout(timeout: null | undefined | number): T {
        this.nativeBuilder.responseTimeout(timeout);
        return this.self();
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
    connectTimeout(timeout: ConnectTimeoutOption): T {
        this.nativeBuilder.connectTimeout(timeout);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Start the assertions.
     */
    assertThat(): ResponseAsserter {
        return new ResponseAsserter(this.nativeBuilder, this.test, this.client);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self(): T;
}



