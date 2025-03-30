import { defineConfig } from 'vitest/config'

const thresholds = process.env.ENABLE_COVERAGE_TRESHOLD === 'true' ? {
  autoUpdate: true,
  statements: 2.66,
  branches: 0,
  functions: 0,
  lines: 2.66,
} : undefined;

export default defineConfig({
  test: {
    exclude: [
      "out/**/*",
      ".vite/**/*"
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
      thresholds:thresholds
    },
  },
})