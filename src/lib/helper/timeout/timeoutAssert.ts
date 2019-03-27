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

    private resolved : boolean = false;

    constructor(msg : string,time : number) {
        this.msg =  msg;
        this.time = time;
    }

    async set() : Promise<void> {
        this.resolved = false;
        return new Promise<void>((r) => {
            this.res = r;
            if(this.time === 0){
                assert.fail(this.msg);
                this.resolve();
            }
            else {
                this.timeoutSet = setTimeout(() => {
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
        }
        else{
            this.resolved = true;
        }
    }
}