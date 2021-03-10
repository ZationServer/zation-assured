/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Client} from "zation-client";

export class ClientUtils {

    static async forEachClient(func: (client: Client) => void | Promise<void>, ...clients: Client[]) {
        const promises: (Promise<void> | void)[] = [];
        for (let i = 0; i < clients.length; i++) {
            promises.push(func(clients[i]));
        }
        await Promise.all(promises);
    }
}