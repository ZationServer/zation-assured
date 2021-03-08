/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


type Action = () => Promise<void> | void;
type TestAction = { action: Action, wait: boolean };

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

    beforeTest(action: Action, waitForTask: boolean = false): void {
        this.currentSubTest.beforeTest(action, waitForTask);
    }

    test(action: Action, waitForTask: boolean = false): void {
        this.currentSubTest.test(action, waitForTask);
    }

    // noinspection JSUnusedGlobalSymbols
    afterTest(action: Action, waitForTask: boolean = false): void {
        this.currentSubTest.afterTest(action, waitForTask);
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

    beforeTest(action: Action, waitForTask: boolean = false): void {
        this._beforeTest.push({action: action, wait: waitForTask});
    }

    test(action: Action, waitForTask: boolean = false): void {
        this._test.push({action: action, wait: waitForTask});
    }

    afterTest(action: Action, waitForTask: boolean = false): void {
        this._afterTest.push({action: action, wait: waitForTask});
    }

    private static async _executeList(list: TestAction[]) {
        let tmpPromises: (Promise<void> | void)[] = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i].wait) {
                if (tmpPromises.length > 0) {
                    await Promise.all(tmpPromises);
                    tmpPromises = [];
                }
                await list[i].action();
            } else {
                tmpPromises.push(list[i].action());
            }
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