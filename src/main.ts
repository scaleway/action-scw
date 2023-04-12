import * as core from '@actions/core';
import path from 'path';
import {fillEnv, install} from './cli.js';
import {type Args, validateArgs} from './input.js';
import {run} from './run.js';


const getArgs = (): Args => ({
    version: core.getInput('version', {
        required: true,
    }),
    access_key: core.getInput('access_key'),
    secret_key: core.getInput('secrey_key'),
    default_organization_id: core.getInput('default_organization_id'),
    default_project_id: core.getInput('default_project_id'),
    args: core.getInput('args'),
});

export const main = async (): Promise<void> => {
    const args = getArgs();

    if (validateArgs(args)) {
        return undefined;
    }

    const cliPath = await install(args.version);

    if (args.args !== '') {
        fillEnv(args);
        const res = await run(args.args, path.join(cliPath, 'scw'));
        if (res !== '') {
            core.setOutput('json', res);
        }
    }

    return undefined;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
