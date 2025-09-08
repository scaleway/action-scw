import * as core from '@actions/core'
import path from 'path'
import { fillEnv, install } from './cli.js'
import { exportConfig, importConfig, saveConfig } from './config.js'
import { type Args, validateArgs } from './input.js'
import { CLIError, run } from './run.js'
import { VERSION_LATEST } from './version.js'

const getArgs = (defaultArgs: Args): Args => ({
  repoToken: core.getInput('repo-token') || defaultArgs.repoToken,
  version: core.getInput('version') || defaultArgs.version || VERSION_LATEST,
  accessKey: core.getInput('access-key') || defaultArgs.accessKey,
  secretKey: core.getInput('secret-key') || defaultArgs.secretKey,
  defaultOrganizationID:
    core.getInput('default-organization-id') ||
    defaultArgs.defaultOrganizationID,
  defaultProjectID:
    core.getInput('default-project-id') || defaultArgs.defaultProjectID,
  args: core.getInput('args') || defaultArgs.args,
  saveConfig: core.getBooleanInput('save-config') || defaultArgs.saveConfig,
  exportConfig:
    core.getBooleanInput('export-config') || defaultArgs.exportConfig,
})

export const main = async () => {
  const configArgs = importConfig()
  const args = getArgs(configArgs)

  if (validateArgs(args)) {
    return
  }

  const cliPath = await install(args.version, args.repoToken)

  if (args.args) {
    fillEnv(args)
    try {
      const res = await run(args.args, path.join(cliPath, 'scw'))
      if (res !== '') {
        core.setOutput('json', res)
      }
    } catch (e) {
      if (e instanceof CLIError) {
        core.error(e.message)
        process.exit(1)
      } else {
        throw e
      }
    }
  }

  if (args.exportConfig) {
    exportConfig(args)
  }

  if (args.saveConfig) {
    await saveConfig(args)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()
