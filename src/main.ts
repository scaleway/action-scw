import * as core from '@actions/core';
import {install} from './cli.js';
import {type Args, validateArgs} from './input.js';


const getArgs = (): Args => ({
    version: core.getInput('version', {
        required: true,
    })
});

export const main = async (): Promise<void> => {
    const args = getArgs();

    if (validateArgs(args)) {
        return;
    }

    await install(args.version);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
