import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@actions/core', () => ({
  isDebug: vi.fn(() => false),
  info: vi.fn(),
}))

import { CLIError, run } from '../run.js'

describe('CLIError', () => {
  it('is an instance of Error with name CLIError', () => {
    const err = new CLIError('test')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('CLIError')
    expect(err.message).toBe('test')
  })
})

describe('run', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws CLIError when command exits with non-zero code', async () => {
    await expect(
      run('--invalid-flag-that-does-not-exist', '/usr/bin/false'),
    ).rejects.toBeInstanceOf(CLIError)
  })

  it('throws Error for invalid command arguments (shell operator)', async () => {
    await expect(run('$(malicious)', 'scw')).rejects.toThrow(
      'Invalid command arguments',
    )
  })
})
