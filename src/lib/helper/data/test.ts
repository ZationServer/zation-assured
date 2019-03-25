/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


type Action = () => Promise<void> | void;

export class Test {
    private _beforeTest : Action[] = [];
    private _test : Action[] = [];
    private _afterTest : Action[] = [];
    private readonly _testDescription : string;

    constructor(testDescription : string) {
        this._testDescription = testDescription;
    }

    private async executeList(list : Action[]) {
        let promises : (Promise<void> | void)[] = [];
        list.forEach((f) => {
            promises.push(f());
        });
        await Promise.all(promises);
    }

    beforeTest(action : Action) : void {
        this._beforeTest.push(action);
    }

    test(action : Action) : void {
        this._test.push(action);
    }

    afterTest(action : Action) : void {
        this._afterTest.push(action);
    }

    execute() {
        it(this._testDescription, async () => {
            await this.executeList(this._beforeTest);
            await this.executeList(this._test);
            await this.executeList(this._afterTest);
        });
    }
}