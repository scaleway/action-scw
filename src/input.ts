import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import { VERSION_LATEST } from './version.js'

export type Args = {
  version: string
  accessKey: string
  secretKey: string
  defaultOrganizationID: string
  defaultProjectID: string
  args: string
  saveConfig: boolean
  exportConfig: boolean
}

const versionIsValid = (version: string): boolean => {
  if (version === VERSION_LATEST) {
    return true
  }
  if (!tc.isExplicitVersion(version)) {
    core.error('')

    return false
  }

  return true
}

export const validateArgs = (args: Args) => !versionIsValid(args.version)
