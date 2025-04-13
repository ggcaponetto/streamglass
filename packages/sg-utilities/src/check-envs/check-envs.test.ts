import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { checkRequiredEnvVars } from './check-envs.js';

const ENV_VARS = [
    'SERVER_SOCKET_IO_PORT',
    'VITE_FRONTEND_ORIGIN',
    'VITE_DESKTOP_ORIGIN',
    'VITE_SERVER_URL',
    'ENABLE_COVERAGE_TRESHOLD',
];

const originalEnv = { ...process.env };

describe('checkRequiredEnvVars', () => {
    beforeEach(() => {
        // Reset all env vars to a known good state before each test
        process.env = { ...originalEnv };
        for (const key of ENV_VARS) {
            process.env[key] = 'test_value';
        }
    });

    afterEach(() => {
        // Restore original environment after each test
        process.env = { ...originalEnv };
        vi.restoreAllMocks();
    });

    it('should not throw if all env vars are set', () => {
        expect(() => checkRequiredEnvVars(ENV_VARS)).not.toThrow();
    });

    it('should throw if any env var is missing', () => {
        delete process.env.SERVER_SOCKET_IO_PORT;

        expect(() => checkRequiredEnvVars(ENV_VARS)).toThrow(
            /Missing required environment variable: SERVER_SOCKET_IO_PORT/
        );
    });

    it('should skip checks in production mode and not throw', () => {
        process.env.NODE_ENV = 'production';

        // Simulate missing vars, should still not throw
        for (const key of ENV_VARS) {
            delete process.env[key];
        }

        expect(() => checkRequiredEnvVars(ENV_VARS)).not.toThrow();
    });

    it('should log baked in variable usage in production', () => {
        process.env.NODE_ENV = 'production';

        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        for (const key of ENV_VARS) {
            delete process.env[key];
        }

        checkRequiredEnvVars(ENV_VARS);

        expect(logSpy).toHaveBeenCalledWith(
            'Production mode detected. Skipping environment variable checks.'
        );
        expect(logSpy).toHaveBeenCalledWith(
            `Running with process.env.NODE_ENV set to production.`
        );

        for (const key of ENV_VARS) {
            expect(logSpy).toHaveBeenCalledWith(
                `Using baked in variable: ${key} - ${process.env[key]}`
            );
        }
    });
});
