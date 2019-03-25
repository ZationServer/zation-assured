/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Logger} from "../helper/console/logger";
import {InstanceManager} from "./instanceManager";

type Func = () => Promise<void> | void;

let firstCall = true;

export const testArea =
    (title : string,area : Func,beforeFunc ?: Func,afterFunc ?: Func) =>
    {
        if(firstCall) {
            firstCall = false;

            Logger.logBusy('Run Tests');

            before(async function() {
                Logger.logBusy('Starting Test server');
                await InstanceManager.getInstance().startTestServer();
                Logger.logInfo('Test server started');
                if(beforeFunc){await beforeFunc();}
            });

            after(async () => {
                await InstanceManager.getInstance().stopTestServer();
                Logger.logInfo('Test server stopped');
                if(afterFunc){await afterFunc();}
            });

            describe(title,async () => {
                await area();
            });
        }
    };