import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@actions/core', () => ({
  addPath: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  isDebug: vi.fn(() => false),
}))

vi.mock('@actions/io', () => ({
  findInPath: vi.fn(async () => []),
}))

vi.mock('@actions/tool-cache', () => ({
  cacheFile: vi.fn(async () => '/cached/scw'),
  downloadTool: vi.fn(async () => '/tmp/scw-binary'),
  find: vi.fn(() => ''),
}))

vi.mock('../version.js', () => ({
  VERSION_LATEST: 'latest',
  getLatest: vi.fn(async () => 'v2.54.0'),
}))

vi.mock('fs', () => ({
  promises: {
    chmod: vi.fn(async () => undefined),
    stat: vi.fn(async () => ({ mode: 0o755 })),
  },
}))

import { fillEnv } from '../cli.js'
import type { Args } from '../input.js'

const baseArgs: Args = {
  repoToken: '',
  version: 'v2.54.0',
  accessKey: '',
  secretKey: '',
  defaultOrganizationID: '',
  defaultProjectID: '',
  args: '',
  saveConfig: false,
  exportConfig: false,
}

describe('fillEnv', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.SCW_ACCESS_KEY
    delete process.env.SCW_SECRET_KEY
    delete process.env.SCW_DEFAULT_ORGANIZATION_ID
    delete process.env.SCW_DEFAULT_PROJECT_ID
  })

  it('sets environment variables from args', () => {
    fillEnv({
      ...baseArgs,
      accessKey: 'my-access',
      secretKey: 'my-secret',
      defaultOrganizationID: 'my-org',
      defaultProjectID: 'my-project',
    })
    expect(process.env.SCW_ACCESS_KEY).toBe('my-access')
    expect(process.env.SCW_SECRET_KEY).toBe('my-secret')
    expect(process.env.SCW_DEFAULT_ORGANIZATION_ID).toBe('my-org')
    expect(process.env.SCW_DEFAULT_PROJECT_ID).toBe('my-project')
  })

  it('does not set env vars when args are empty strings', () => {
    fillEnv(baseArgs)
    expect(process.env.SCW_ACCESS_KEY).toBeUndefined()
    expect(process.env.SCW_SECRET_KEY).toBeUndefined()
  })
})
