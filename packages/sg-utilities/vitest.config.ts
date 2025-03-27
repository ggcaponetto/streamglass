import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      reportsDirectory: './coverage',
      reportOnFailure: true,
      provider: 'v8',
      reporter: ['json-summary', 'html', 'text'],
      include: [
        "src/**/*"
      ],
      thresholds:{
        autoUpdate: true,
        statements: 97.29,
        branches: 80,
        functions: 100,
        lines: 97.29,
      }
    },
  },
})