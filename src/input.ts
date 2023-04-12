import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

export type Args = {
    version: string
    access_key: string
    secret_key: string
    default_organization_id: string
    default_project_id: string
    args: string
}

const versionIsValid = (version: string): boolean => {
    if (version === 'latest') {
        return true;
    }
    if (!tc.isExplicitVersion(version)) {
        core.error('');

        return false;
    }

    return true;
};

export const validateArgs = (args: Args): boolean => {
    const invalid = !versionIsValid(args.version);

    return invalid;
};
