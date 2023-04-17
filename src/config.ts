import * as core from '@actions/core'
import type { Args } from './input.js'

export const exportConfig = (args: Args) => {
  core.exportVariable('SCW_ACCESS_KEY', args.accessKey)
  core.setSecret(args.secretKey)
  core.exportVariable('SCW_SECRET_KEY', args.secretKey)
  core.exportVariable('SCW_DEFAULT_ORGANIZATION_ID', args.defaultOrganizationID)
  core.exportVariable('SCW_DEFAULT_PROJECT_ID', args.defaultProjectID)
  core.exportVariable('SCW_CLI_VERSION', args.version)
}

export const importConfig = (): Args => ({
  defaultOrganizationID: process.env.SCW_DEFAULT_ORGANIZATION_ID || '',
  defaultProjectID: process.env.SCW_DEFAULT_PROJECT_ID || '',
  secretKey: process.env.SCW_SECRET_KEY || '',
  version: process.env.SCW_CLI_VERSION || '',
  accessKey: process.env.SCW_ACCESS_KEY || '',
  args: '',
  exportConfig: '',
  saveConfig: '',
})
