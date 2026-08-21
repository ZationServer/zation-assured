/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

import {
    ValidationCheckPair,
    Client,
    AUTH_CONTROLLER,
    ChecksContent,
    Response,
    FilterAPIDefinition, AnyControllerDef, ReceiverDef
} from 'zation-client';
import {Test} from "../helper/test/test";
import {
    ExtractControllerDefInput,
    ExtractControllerDefOutput,
    ExtractAuthControllerDef
} from "zation-client";
import TransmitOptions, {RequestOptions,ValidationRequestOptions} from "../helper/definitions/optionTypes";
import AssertStarter from "../helper/asserter/assertStarter";
import {IntegratedResponseAsserter} from "../helper/asserter/controller/integratedResponseAsserter";
import {IntegratedTransmitAsserter} from "../helper/asserter/receiver/integratedTransmitAsserter";
import {ClientAPI} from "../helper/utils/types";
import {SystemController} from "zation-client/dist/lib/main/definitions/systemController";
import {ExtractAuthControllerDef} from "zation-client/dist/lib/main/definitions/apiDefinition";

export class WhenBuilder<C extends Client<any,any>> {

    private readonly _client: C;
    private readonly _test: Test;

    constructor(client: C, test: Test) {
        this._client = client;
        this._test = test;
    }

    static when<C extends Client<any,any>>(client: C, it?: string): WhenBuilder<C> {
        return new WhenBuilder(client, new Test(it));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a request test action.
     * @example
     * when(client1)
     *  .request('sendMessage',message)
     *  .assertThat....
     * @param controller
     * @param data
     * @param options
     */
    request<CN extends keyof FilterAPIDefinition<ClientAPI<C>,AnyControllerDef> | typeof AUTH_CONTROLLER | SystemController>
    (controller: CN,
     data?: CN extends typeof AUTH_CONTROLLER ? ExtractControllerDefInput<ExtractAuthControllerDef<ClientAPI<C>>> :
         ExtractControllerDefInput<FilterAPIDefinition<ClientAPI<C>,CN>>,
     options: RequestOptions = {}
    ): AssertStarter<IntegratedResponseAsserter<Response<ExtractControllerDefOutput<FilterAPIDefinition<ClientAPI<C>,CN>>>,C>> {
        return new AssertStarter(new IntegratedResponseAsserter<Response<ExtractControllerDefOutput<FilterAPIDefinition<ClientAPI<C>,CN>>>,C>(() =>
            this._client.request(controller as any,data,{...options,unwrapResult: false}),this._test,this._client));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a request validation test action.
     * This action sends a validation request to a specific controller.
     * Validation requests only validate the given checks with the controller input models.
     * The controller handle method will not be invoked.
     * It is helpful to check form inputs directly even if the user
     * has not filled out the complete data.
     * @example
     * //Check builder usage (typesafe):
     * when(client1)
     *  .requestValidation('sendMessage',s => {
     *     s.msg.check("Hello!");
     *  })
     *  .assertThat....
     * //Raw usage (not typesafe):
     * when(client1)
     *  .requestValidation('sendMessage',[[['msg'],'Hello!']]);
     *  .assertThat....
     * @param controller
     * @param checks
     * @param options
     */
    requestValidation<CN extends keyof FilterAPIDefinition<ClientAPI<C>,AnyControllerDef> | typeof AUTH_CONTROLLER>
    (controller: CN,
     checks: ValidationCheckPair[] |
         ((structure: ChecksContent<CN extends typeof AUTH_CONTROLLER ? ExtractControllerDefInput<ExtractAuthControllerDef<ClientAPI<C>>> :
             ExtractControllerDefInput<FilterAPIDefinition<ClientAPI<C>,CN>>>) => void),
     options: ValidationRequestOptions = {}): AssertStarter<IntegratedResponseAsserter<Response<void>,C>> {
        return new AssertStarter(new IntegratedResponseAsserter<Response<void>,C>(() =>
            this._client.requestValidation(controller as any,checks as any,options),this._test,this._client));
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a transmit test action.
     * @example
     * when(client1)
     *  .transmit('updatePosition',[1,2,2])
     *  .assertThat....
     * @param receiver
     * @param data
     * @param options
     */
    transmit<RN extends keyof FilterAPIDefinition<ClientAPI<C>,ReceiverDef>>(
        receiver: RN,
        data?: ClientAPI<C>['receivers'][RN],
        options: TransmitOptions = {}
    ): AssertStarter<IntegratedTransmitAsserter<C>> {
        return new AssertStarter(new IntegratedTransmitAsserter<C>(() =>
            this._client.transmit(receiver as any,data,options),this._test,this._client));
    }
}

export const when = WhenBuilder.when;