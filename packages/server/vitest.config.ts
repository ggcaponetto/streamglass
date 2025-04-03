import { defineConfig } from 'vitest/config'

const thresholds = process.env.ENABLE_COVERAGE_TRESHOLD === 'true' ? {
  autoUpdate: true,
  statements: 86.56,
  branches: 80,
  functions: 87.5,
  lines: 86.56,
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
      exclude: ['coverage', 'html'],
      thresholds: thresholds
    },
  },
})