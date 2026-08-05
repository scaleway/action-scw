import { describe, expect, it } from 'vitest'
import { VERSION_LATEST } from '../version.js'

describe('VERSION_LATEST', () => {
  it('equals "latest"', () => {
    expect(VERSION_LATEST).toBe('latest')
  })
})
