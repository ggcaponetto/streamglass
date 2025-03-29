import { defineConfig } from 'vitest/config'

const thresholds = import.meta.env.ENABLE_COVERAGE_TRESHOLD === 'true' ? {
  autoUpdate: true,
  statements: 97.29,
  branches: 80,
  functions: 100,
  lines: 97.29,
} : undefined;

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
      thresholds: thresholds
    },
  },
})