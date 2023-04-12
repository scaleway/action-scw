import * as core from '@actions/core';
import {spawn} from 'child_process';
import {parse} from 'shell-quote';

type spawnResult = {
    code: number | null
    stdout: string | null
    stderr: string | null
}

const spawnPromise = async (command: string, args: string[]): Promise<spawnResult> => new Promise((resolve, reject) => {
    const process = spawn(command, args);
    process.stdout.setEncoding('utf-8');
    process.stderr.setEncoding('utf-8');

    process.on('exit', code => {
        resolve({
            code,
            stdout: process.stdout.read() as string | null,
            stderr: process.stderr.read() as string | null,
        });
    });
    process.on('error', err => {
        reject(err);
    });
});

const parseCmdArgs = (args: string, base = new Array<string>()): string[] => {
    const cmdArgs = base;
    const parseEntries = parse(args);

    for (const parseEntry of parseEntries) {
        if (typeof parseEntry !== 'string') {
            throw new Error('Invalid command arguments');
        }
        cmdArgs.push(parseEntry);
    }

    return cmdArgs;
};

export const run = async (args: string, cliPath = 'scw'): Promise<string> => {
    const baseArgs = ['-o=json'];
    if (core.isDebug()) {
        baseArgs.push('--debug');
    }

    const cmdArgs = parseCmdArgs(args, baseArgs);

    const res = await spawnPromise(cliPath, cmdArgs);
    if (res.code !== 0) {
        core.error(`failed to run command, code: ${res.code || 'null'}`);
        core.info(res.stderr || '');

        return '';
    }
    core.info(res.stdout || '');

    return res.stdout || '';
};

