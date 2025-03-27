import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['json-summary'],
      thresholds:{
        autoUpdate: true,
        functions: 77.77,
        branches: 80,
        statements: 85.07,
      }
    },
  },
})