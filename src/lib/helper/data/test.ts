/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


type Action = () => Promise<void> | void;
type TestAction = {action : Action, wait : boolean};

export class Test {
    private _test : TestAction[] = [];
    private readonly _testDescription : string;

    constructor(testDescription : string) {
        this._testDescription = testDescription;
    }

    test(action : Action,waitForTask : boolean = false) : void {
        this._test.push({action : action,wait : waitForTask});
    }

    execute() {
        it(this._testDescription, async () => {
            let tmpPromises : (Promise<void> | void )[] = [];
            for(let i = 0; i < this._test.length; i++) {
                if(this._test[i].wait){
                    if(tmpPromises.length>0){
                        await Promise.all(tmpPromises);
                        tmpPromises = [];
                    }
                    await this._test[i].action();
                }
                else {
                    tmpPromises.push(this._test[i].action());
                }
            }
            if(tmpPromises.length>0){
                await Promise.all(tmpPromises);
            }
        });
    }
}