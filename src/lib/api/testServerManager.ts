/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const childProcess = require('child_process');
const exec = childProcess.exec;
const fork = childProcess.fork;
const uuid = require('uuid');
const path  = require('path');

interface TestServerConfig {
    port : number,
    volume : string
}

export class TestServerManager {

    private static config: TestServerConfig = {
        port : 3001,
        volume : process.cwd()
    };
    private static instance: TestServerManager | null = null;

    private testServerId : string = 'testServer-'+process.pid;
    private testServerInstance;

    static getInstance() : TestServerManager {
        if(TestServerManager.instance !== null) {
            return TestServerManager.instance;
        }
        else {
            TestServerManager.instance = new TestServerManager();
            return TestServerManager.instance;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    static set Config(config : TestServerConfig) {
        TestServerManager.config = config;
    }

    // noinspection JSUnusedGlobalSymbols
    static get Config() : TestServerConfig {
        return TestServerManager.config;
    }

    private constructor() {}

    async startTestServer()
    {
        return new Promise((resolve, reject) => {
            const instanceProcess = exec(`docker run --env TEST=true -p ` +
            `127.0.0.1:${TestServerManager.config.port}:${TestServerManager.config.port} -v ${TestServerManager.config.volume}:/usr/src/app/:z ` +
            `-w /usr/src/app/ --expose ${TestServerManager.config.port} --network="host" --name ${this.testServerId} node:8.9 npm run start:docker:test`, (err) =>
            {
                if (err) {
                    reject(err);
                }
            });
            instanceProcess.stdout.on('data', (data) => {
               if(data.indexOf('started') !== -1) {
                    this.testServerInstance = instanceProcess;
                    setTimeout(() => {
                        resolve(instanceProcess);
                    },2000);

                }
            });
            instanceProcess.stdout.pipe(process.stdout);
        });
    }

    async stopTestServer()
    {
        await this.stopDockerInstance();
        await this.rmDockerInstance();
        if(this.testServerInstance){
            this.testServerInstance.kill();
        }
    }

    private async stopDockerInstance() {
        await new Promise((resolve) => {
            exec(`docker stop ${this.testServerId}`, () => {
                resolve();
            });
        });
    }

    private async rmDockerInstance() {
        await new Promise((resolve) => {
            exec(`docker rm -f ${this.testServerId}`, () => {
                resolve();
            });
        });
    }

}

export const getInstanceManager = () : TestServerManager => {
    return TestServerManager.getInstance();
};
