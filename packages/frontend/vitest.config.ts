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
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      }
    },
  },
})