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


export class InstanceManager {

    private static instance: InstanceManager | null = null;

    static getInstance() : InstanceManager {
        if(InstanceManager.instance !== null) {
            return InstanceManager.instance;
        }
        else {
            InstanceManager.instance = new InstanceManager();
            return InstanceManager.instance;
        }
    }

    private constructor() {



    }



}

export const getInstanceManager = () : InstanceManager => {
    return InstanceManager.getInstance();
};
