/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const assert = require('assert');

export class TimeoutAssert {

    private readonly msg;
    private readonly time;

    private timeoutSet;
    private res;

    private readonly _onSuccess : (() => void)[] = [];

    private resolved : boolean = false;
    private success : boolean = true;

    constructor(msg : string,time : number) {
        this.msg =  msg;
        this.time = time;
    }

    onSuccess(func : () => void) : void {
        this._onSuccess.push(func);
    }

    async set() : Promise<void> {
        this.resolved = false;
        this.success = true;
        return new Promise<void>((r) => {
            this.res = r;
            if(this.time === 0){
                this.success = false;
                assert.fail(this.msg);
                this.resolve();
            }
            else {
                this.timeoutSet = setTimeout(() => {
                    this.success = false;
                    assert.fail(this.msg);
                    this.resolve();
                },this.time);
            }
        });
    }

    resolve() {
        if(!this.resolved){
            if(this.timeoutSet) {
                clearTimeout(this.timeoutSet);
            }
            if(typeof this.res === 'function'){
                this.res();
            }
            if(this.success){
                this._onSuccess.forEach((f) => {f();});
            }
        }
        else{
            this.resolved = true;
        }
    }
}