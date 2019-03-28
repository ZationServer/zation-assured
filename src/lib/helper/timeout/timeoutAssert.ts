/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const assert = require('assert');

export class TimeoutAssert {

    private readonly msg;
    private readonly time;
    private readonly invert : boolean;

    private timeoutSet;
    private res;

    private resolved : boolean = false;
    private success : boolean = true;

    constructor(msg : string,time : number,invert : boolean = false) {
        this.msg =  msg;
        this.time = time;
        this.invert = invert;
    }

    async set() : Promise<void> {
        this.resolved = false;
        this.success = true;
        return new Promise<void>((r) => {
            this.res = r;
            if(this.time === 0){
                //success resolved in (invert = true) otherwise fail
                this.success = this.invert;
                if(!this.invert) {
                    assert.fail(this.msg);
                }
                this.resolve(true);
            }
            else {
                this.timeoutSet = setTimeout(() => {
                    //success resolved in (invert = true) otherwise fail
                    this.success = this.invert;
                    if(!this.invert){
                        assert.fail(this.msg);
                    }
                    this.resolve(true);
                },this.time);
            }
        });
    }

    isSuccess() : boolean {
        return this.success;
    }

    resolve(internalCall : boolean = false) {
        if(!this.resolved){
            if(this.timeoutSet) {
                clearTimeout(this.timeoutSet);
            }
            if(typeof this.res === 'function'){
                this.res();
            }
            //ups in invert mode that means it is resolved before timeout (from outside).
            if(!internalCall && this.invert){
                assert.fail(this.msg);
            }
            this.resolved = true;
        }
    }
}