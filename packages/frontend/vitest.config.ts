import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'playwright-tests/*'],
    coverage: {
      provider: 'v8',
      reporter: ['json-summary'],
      thresholds:{
        autoUpdate: true,
        functions: 0,
        branches: 0,
        statements: 0,
      }
    },
  },
})