import { vi, describe, it, expect } from 'vitest';

// Mock the checkRequiredEnvVars function
vi.mock('sg-utilities/check-envs', () => ({
    checkRequiredEnvVars: vi.fn(),
}));

// Mock the startServer function
vi.mock('./socket-io/socket.js', () => ({
    startServer: vi.fn(),
}));

describe('main module', () => {
    it('should call checkRequiredEnvVars and startServer', async () => {
        const { checkRequiredEnvVars } = await import(
            'sg-utilities/check-envs'
        );
        const { startServer } = await import('./socket-io/socket.js');

        // Import the module under test after mocks are set
        await import('./index.js'); // Assuming this is the name of the file

        expect(checkRequiredEnvVars).toHaveBeenCalledWith([
            'SERVER_SOCKET_IO_PORT',
            'VITE_FRONTEND_ORIGIN',
            'VITE_DESKTOP_ORIGIN',
            'VITE_SERVER_URL',
            'ENABLE_COVERAGE_TRESHOLD',
        ]);
        expect(startServer).toHaveBeenCalled();
    });
});
