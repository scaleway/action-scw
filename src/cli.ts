import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import {promises as fs} from 'fs';
import type {Args} from './input.js';
import {getLatest} from './version.js';

const TOOL_NAME = 'scw';

const downloadURL = (_version: string): string => {
    let version = _version;

    if (version.startsWith('v')) {
        version = version.slice(1);
    }

    return `https://github.com/scaleway/scaleway-cli/releases/download/v${version}/scaleway-cli_${version}_linux_amd64`;
};

const isInPath = (toolPath: string): boolean => {
    const envPath = process.env.PATH;
    if (envPath === undefined) {
        return false;
    }

    return envPath.split(':').includes(toolPath);
};

const addToPath = (toolPath: string) => {
    const envPath = process.env.PATH;
    if (envPath === undefined) {
        process.env.PATH = toolPath;
    } else {
        process.env.PATH = `${envPath}:${toolPath}`;
    }
};

const setPermissions = async (cliPath: string) => {
    core.debug(`chmod ${cliPath}`);

    await fs.chmod(cliPath, 0o755); // rwx r-x r-x

    if (core.isDebug()) {
        const st = await fs.stat(cliPath);
        core.debug(`mode ${st.mode}`);
    }
};

export const install = async (_version: string) => {
    let version = _version;

    if (version === 'latest') {
        version = await getLatest();
    }

    let toolPath = tc.find('scw', version);
    if (toolPath === '') {
        core.info(`Didn't found CLI in cache, downloading ${version}`);
        const tmpCliPath = await tc.downloadTool(downloadURL(version));
        await setPermissions(tmpCliPath);
        toolPath = await tc.cacheFile(tmpCliPath, 'scw', TOOL_NAME, version);
    } else {
        core.info(`Found CLI ${version} in cache`);
    }

    const binaries = await io.findInPath('scw');
    if (binaries.length === 0 && !isInPath(toolPath)) {
        core.info('Adding CLI to path');
        addToPath(toolPath);
        core.addPath(toolPath);
    }

    return toolPath;
};

export const fillEnv = (args: Args) => {
    process.env.SCW_ACCESS_KEY = args.access_key;
    process.env.SCW_SECRET_KEY = args.secret_key;
    process.env.SCW_DEFAULT_ORGANIZATION_ID = args.default_organization_id;
    process.env.SCW_DEFAULT_PROJECT_ID = args.default_project_id;
};
