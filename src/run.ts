import * as core from '@actions/core'
import { spawn } from 'child_process'
import { parse } from 'shell-quote'

type SpawnResult = {
  code: number | null
  stdout: string | null
  stderr: string | null
}

export class CLIError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CLIError'
  }
}

const spawnPromise = async (
  command: string,
  args: string[],
): Promise<SpawnResult> =>
  new Promise((resolve, reject) => {
    const process = spawn(command, args)
    process.stdout.setEncoding('utf-8')
    process.stderr.setEncoding('utf-8')

    process.on('exit', code => {
      resolve({
        code,
        stdout: process.stdout.read() as string | null,
        stderr: process.stderr.read() as string | null,
      })
    })
    process.on('error', err => {
      reject(err)
    })
  })

const parseCmdArgs = (args: string) =>
  parse(args).map(arg => {
    if (typeof arg !== 'string') {
      throw new Error('Invalid command arguments')
    }

    return arg
  })

export const run = async (args: string, cliPath = 'scw') => {
  const defaultArgs = ['-o=json']
  if (core.isDebug()) {
    defaultArgs.push('--debug')
  }

  const cmdArgs = defaultArgs.concat(parseCmdArgs(args))

  const res = await spawnPromise(cliPath, cmdArgs)
  if (res.code !== 0) {
    core.info(res.stderr || '')
    throw new CLIError(`failed to run command, code: ${res.code || 'null'}`)
  }
  core.info(res.stdout || '')

  return res.stdout || ''
}
