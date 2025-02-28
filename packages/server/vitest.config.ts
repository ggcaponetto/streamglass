import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['json-summary'],
      thresholds:{
        autoUpdate: true,
        functions: 50,
        branches: 50,
        statements: 94.11,
      }
    },
  },
})