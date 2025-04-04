import { defineConfig } from 'vitest/config';

const thresholds =
    process.env.ENABLE_COVERAGE_TRESHOLD === 'true'
        ? {
              autoUpdate: true,
              statements: 97.29,
              branches: 80,
              functions: 100,
              lines: 97.29,
          }
        : undefined;

export default defineConfig({
    test: {
        include: ['./src/**'],
        exclude: ['./coverage/**', './html/**'],
        coverage: {
            enabled: true,
            reportsDirectory: './coverage',
            reportOnFailure: true,
            provider: 'v8',
            reporter: ['json-summary', 'html', 'text'],
            include: ['./src/**'],
            exclude: ['./coverage/**', './html/**'],
            thresholds: thresholds,
        },
    },
});
