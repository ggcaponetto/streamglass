// 👇 Always put this first — before imports
vi.mock('./message-handler/message-handler.js', () => ({
    handleMessage: vi.fn(),
}));

import {
    validateEnv,
    getPort,
    createHttpServer,
    createSocketServer,
    handleConnection,
    startServer,
} from './socket.js';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

describe('socketServer', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        vi.restoreAllMocks();
        process.env = { ...OLD_ENV }; // Clone before each
        process.env.SERVER_SOCKET_IO_PORT = '4000';
        process.env.SERVER_CLIENT_ORIGIN = 'http://localhost:3000';
    });

    describe('validateEnv', () => {
        it('throws if SERVER_SOCKET_IO_PORT is missing', () => {
            delete process.env.SERVER_SOCKET_IO_PORT;
            expect(() => validateEnv()).toThrow();
        });

        it('throws if SERVER_CLIENT_ORIGIN is missing', () => {
            delete process.env.SERVER_CLIENT_ORIGIN;
            expect(() => validateEnv()).toThrow();
        });

        it('does not throw if all env vars are present', () => {
            expect(() => validateEnv()).not.toThrow();
        });
    });

    describe('getPort', () => {
        it('parses port correctly', () => {
            process.env.SERVER_SOCKET_IO_PORT = '1234';
            expect(getPort()).toBe(1234);
        });
    });

    describe('createHttpServer', () => {
        it('creates an HTTP server', () => {
            const server = createHttpServer();
            expect(server).toBeDefined();
            expect(typeof server.listen).toBe('function');
        });
    });

    describe('createSocketServer', () => {
        it('creates a Socket.IO server and attaches handlers', () => {
            const httpServer = createHttpServer();
            const io = createSocketServer(httpServer);
            expect(io).toBeInstanceOf(Server);
        });
    });

    describe('handleConnection', () => {
        it('logs and sets up socket handlers', () => {
            const socket = {
                id: 'abc123',
                on: vi.fn(),
                emit: vi.fn(),
            } as unknown as Socket;

            handleConnection(socket);

            expect(socket.on).toHaveBeenCalledWith(
                'disconnect',
                expect.any(Function)
            );
            expect(socket.on).toHaveBeenCalledWith(
                'data',
                expect.any(Function)
            );
        });
    });

    describe('startServer', () => {
        it('starts listening on the provided port', () => {
            const io = {
                listen: vi.fn(),
            } as unknown as Server;

            startServer(io, 5000);
            expect(io.listen).toHaveBeenCalledWith(5000);
        });
    });
});
