/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ZationClient} from "zation-client";

export class ClientUtils {

    static async forEachClient(func : (client : ZationClient) => void | Promise<void>,...clients : ZationClient[]) {
        const promises : (Promise<void> | void)[] = [];
        for(let i = 0; i < clients.length; i++){
            promises.push(func(clients[i]));
        }
        await Promise.all(promises);
    }
}