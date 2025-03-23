import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['json-summary'],
      thresholds:{
        autoUpdate: true,
        functions: 100,
        branches: 81.81,
        statements: 97.29,
      }
    },
  },
})