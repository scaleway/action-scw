import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@actions/core', () => ({
  exportVariable: vi.fn(),
  setSecret: vi.fn(),
}))

vi.mock('../run.js', () => ({
  run: vi.fn(),
}))

import * as core from '@actions/core'
import { exportConfig, importConfig } from '../config.js'
import type { Args } from '../input.js'

const baseArgs: Args = {
  repoToken: 'token',
  version: 'v2.54.0',
  accessKey: 'access-key',
  secretKey: 'secret-key',
  defaultOrganizationID: 'org-id',
  defaultProjectID: 'project-id',
  args: '',
  saveConfig: false,
  exportConfig: false,
}

describe('exportConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports all environment variables', () => {
    exportConfig(baseArgs)
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SCW_ACCESS_KEY',
      'access-key',
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SCW_SECRET_KEY',
      'secret-key',
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SCW_DEFAULT_ORGANIZATION_ID',
      'org-id',
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SCW_DEFAULT_PROJECT_ID',
      'project-id',
    )
    expect(core.exportVariable).toHaveBeenCalledWith(
      'SCW_CLI_VERSION',
      'v2.54.0',
    )
    expect(core.setSecret).toHaveBeenCalledWith('secret-key')
  })
})

describe('importConfig', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('imports empty values when env vars not set', () => {
    delete process.env.SCW_ACCESS_KEY
    delete process.env.SCW_SECRET_KEY
    delete process.env.SCW_DEFAULT_ORGANIZATION_ID
    delete process.env.SCW_DEFAULT_PROJECT_ID
    delete process.env.SCW_CLI_VERSION

    const result = importConfig()
    expect(result.accessKey).toBe('')
    expect(result.secretKey).toBe('')
    expect(result.defaultOrganizationID).toBe('')
    expect(result.defaultProjectID).toBe('')
    expect(result.version).toBe('')
  })

  it('reads values from environment variables', () => {
    process.env.SCW_ACCESS_KEY = 'my-access'
    process.env.SCW_SECRET_KEY = 'my-secret'
    process.env.SCW_DEFAULT_ORGANIZATION_ID = 'my-org'
    process.env.SCW_DEFAULT_PROJECT_ID = 'my-project'
    process.env.SCW_CLI_VERSION = 'v2.50.0'

    const result = importConfig()
    expect(result.accessKey).toBe('my-access')
    expect(result.secretKey).toBe('my-secret')
    expect(result.defaultOrganizationID).toBe('my-org')
    expect(result.defaultProjectID).toBe('my-project')
    expect(result.version).toBe('v2.50.0')
  })
})
