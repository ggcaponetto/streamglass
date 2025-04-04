import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        workspace: ['packages/*'],
        include: [
            './packages/sg-utilities/src/**',
            './packages/server/src/**',
            './packages/frontend/src/**',
            './packages/desktop/src/**/*',
        ],
        coverage: {
            exclude: [
                './packages/sg-utilities/coverage',
                './packages/sg-utilities/html',
                './packages/server/coverage',
                './packages/server/html',
                './packages/frontend/coverage',
                './packages/frontend/html',
                './packages/frontend/.vercel',
                './packages/frontend/dist',
                './packages/frontend/playwright-report',
                './packages/desktop/.vite',
                './packages/desktop/coverage',
                './packages/desktop/html',
                './packages/desktop/out',
            ],
        },
    },
});
