/*
Author: Ing. Luca Gian Scaringella
GitHub: LucaCode
Copyright(c) Ing. Luca Gian Scaringella
 */

const waitSymbol = Symbol();
type Action = () => Promise<void> | void;
type TestAction = Action | typeof waitSymbol;

export class Test {

    private readonly _subTests: SubTest[] = [];
    private currentSubTest: SubTest;
    private readonly _testItDescription?: string;

    constructor(testItDescription?: string) {
        this._testItDescription = testItDescription;
        this.newSubTest();
    }

    newSubTest() {
        const subTest = new SubTest();
        this.currentSubTest = subTest;
        this._subTests.push(subTest);
    }

    beforeTest(action: Action): void {
        this.currentSubTest.beforeTest(action);
    }

    test(action: Action): void {
        this.currentSubTest.test(action);
    }


    pushSyncWait(): void {
        this.currentSubTest.pushSyncWait();
    }

    // noinspection JSUnusedGlobalSymbols
    afterTest(action: Action): void {
        this.currentSubTest.afterTest(action);
    }

    private async _run() {
        for (let i = 0; i < this._subTests.length; i++) {
            await this._subTests[i].execute();
        }
    }

    async execute() {
        if (this._testItDescription != null) {
            return new Promise<void>((resolve, reject) => {
                it(this._testItDescription!, async () => {
                    try {
                        await this._run();
                        resolve();
                    } catch (e) {
                        reject(e);
                        throw e;
                    }
                });
            })
        } else await this._run();
    }
}

class SubTest {
    private _beforeTest: TestAction[] = [];
    private _test: TestAction[] = [];
    private _afterTest: TestAction[] = [];

    beforeTest(action: Action): void {
        this._beforeTest.push(action);
    }

    test(action: Action): void {
        this._test.push(action);
    }

    pushSyncWait(): void {
        this._test.push(waitSymbol);
    }

    afterTest(action: Action): void {
        this._afterTest.push(action);
    }

    private static async _executeList(list: TestAction[]) {
        let tmpPromises: (Promise<void> | void)[] = [];
        for (const action of list) {
            if (action === waitSymbol) {
                if (tmpPromises.length > 0) {
                    await Promise.all(tmpPromises);
                    tmpPromises = [];
                }
            } else tmpPromises.push(action());
        }
        if (tmpPromises.length > 0) {
            await Promise.all(tmpPromises);
        }
    }

    async execute() {
        await SubTest._executeList(this._beforeTest);
        await SubTest._executeList(this._test);
        await SubTest._executeList(this._afterTest);
    }
}