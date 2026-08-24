import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['cobertura'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts'],
    },
  },
})
