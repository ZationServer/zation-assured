/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

export class Logger {

    static logBusy(message: string) {
        console.log('\x1b[33m%s\x1b[0m', '   [BUSY]', message);
    }

    static logInfo(message: string) {
        console.log('\x1b[34m%s\x1b[0m', '   [INFO]', message);
    }

}