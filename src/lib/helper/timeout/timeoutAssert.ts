/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

const assert = require('assert');

export class TimeoutAssert {

    private readonly msg: string;
    private readonly time: number;
    private readonly assertNotOccur: boolean;

    private _set: boolean = false;

    private _timeoutTicker;

    private _resolve: () => void;
    private _reject: (err?: any) => void;
    private _promiseEnd: boolean = false;
    private readonly promise: Promise<void> = new Promise<void>(((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
    }))

    constructor(msg: string, time: number, assertNotOccur: boolean = false) {
        this.msg = msg;
        this.time = time;
        this.assertNotOccur = assertNotOccur;
    }

    async set(): Promise<void> {
        if(this._set) throw new Error('TimeoutAsserter already set.');
        this._set = true;
        this._timeoutTicker = setTimeout(() => {
            if (this.assertNotOccur) this.internalResolve();
            else this.internalReject();
        }, this.time);
        return this.promise;
    }

    private internalReject() {
        if(this._promiseEnd) return;
        this._promiseEnd = true;
        this._reject(new assert.AssertionError({message: this.msg}))
    }

    private internalResolve() {
        if(this._promiseEnd) return;
        this._promiseEnd = true;
        this._resolve();
    }

    resolve() {
        if (!this._promiseEnd) {
            if (this._timeoutTicker) clearTimeout(this._timeoutTicker);
            if(this.assertNotOccur) this.internalReject();
            else this.internalResolve();
        }
    }
}