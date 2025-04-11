import { describe, it, expect } from 'vitest';
import { checkRequiredEnvVars } from './check-envs.js';

describe('checkRequiredEnvVars', () => {
    const ENV_VARS = [
        'SERVER_SOCKET_IO_PORT',
        'VITE_FRONTEND_ORIGIN',
        'VITE_DESKTOP_ORIGIN',
        'VITE_SERVER_URL',
        'ENABLE_COVERAGE_TRESHOLD',
    ];

    it('should not throw if all env vars are set', () => {
        for (const key of ENV_VARS) {
            process.env[key] = 'test_value';
        }

        expect(() => checkRequiredEnvVars(ENV_VARS)).not.toThrow();
    });

    it('should throw if any env var is missing', () => {
        delete process.env.SERVER_SOCKET_IO_PORT; // Ensure one is missing

        expect(() => checkRequiredEnvVars(ENV_VARS)).toThrow(
            /Missing required environment variable: SERVER_SOCKET_IO_PORT/
        );
    });
});
