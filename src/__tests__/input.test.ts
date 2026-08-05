import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@actions/core', () => ({
  error: vi.fn(),
}))

vi.mock('@actions/tool-cache', () => ({
  isExplicitVersion: vi.fn((v: string) => /^v?\d+\.\d+\.\d+$/.test(v)),
}))

import { validateArgs } from '../input.js'
import type { Args } from '../input.js'

const baseArgs: Args = {
  repoToken: '',
  version: 'latest',
  accessKey: '',
  secretKey: '',
  defaultOrganizationID: '',
  defaultProjectID: '',
  args: '',
  saveConfig: false,
  exportConfig: false,
}

describe('validateArgs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns false (valid) for version "latest"', () => {
    expect(validateArgs({ ...baseArgs, version: 'latest' })).toBe(false)
  })

  it('returns false (valid) for explicit semver version', () => {
    expect(validateArgs({ ...baseArgs, version: 'v2.54.0' })).toBe(false)
  })

  it('returns true (invalid) for non-semver version', () => {
    expect(validateArgs({ ...baseArgs, version: 'not-a-version' })).toBe(true)
  })
})
