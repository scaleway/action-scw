import * as core from '@actions/core';
import path from 'path';
import {fillEnv, install} from './cli.js';
import {type Args, validateArgs} from './input.js';
import {CLIError, run} from './run.js';


const getArgs = (): Args => ({
    version: core.getInput('version', {
        required: true,
    }),
    access_key: core.getInput('access_key'),
    secret_key: core.getInput('secret_key'),
    default_organization_id: core.getInput('default_organization_id'),
    default_project_id: core.getInput('default_project_id'),
    args: core.getInput('args'),
});

export const main = async (): Promise<void> => {
    const args = getArgs();

    if (validateArgs(args)) {
        return;
    }

    const cliPath = await install(args.version);

    if (args.args) {
        fillEnv(args);
        try {
            const res = await run(args.args, path.join(cliPath, 'scw'));
            if (res !== '') {
                core.setOutput('json', res);
            }
        } catch (e) {
            if (e instanceof CLIError) {
                core.error(e.message);
                process.exit(1);
            } else {
                throw e;
            }
        }

    }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
