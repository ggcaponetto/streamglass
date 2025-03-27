import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [
      "playwright-tests/**/*"
    ],
    environment: "jsdom",
    coverage: {
      enabled: false,
      reportsDirectory: './coverage',
      reportOnFailure: true,
      provider: 'v8',
      reporter: ['json-summary', 'html', 'text'],
      include: [
        "src/**/*.{ts,tsx}"
      ],
      thresholds:{
        autoUpdate: true,
        statements: 2.66,
        branches: 0,
        functions: 0,
        lines: 2.66,
      }
    },
  },
})