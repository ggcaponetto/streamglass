// 👇 Always put this first — before imports
vi.mock('./message-handler/message-handler.js', () => ({
    handleMessage: vi.fn(),
}));

import {
    getPort,
    createHttpServer,
    createSocketServer,
    handleConnection,
} from './socket.js';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { State } from '../socket-state/socket-state.js';

describe('socketServer', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        vi.restoreAllMocks();
        process.env = { ...OLD_ENV }; // Clone before each
        process.env.SERVER_SOCKET_IO_PORT = '4000';
        process.env.VITE_FRONTEND_ORIGIN = 'http://localhost:5173';
        process.env.VITE_DESKTOP_ORIGIN = 'http://localhost:5174';
        process.env.VITE_SERVER_URL = 'ws://localhost:3001';
        process.env.ENABLE_COVERAGE_TRESHOLD = 'false';
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
            const state = State();
            const io = createSocketServer(httpServer, state);
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

            const state = State();
            const mockPairingCode = 'pairingCode123';

            handleConnection(socket, state, mockPairingCode);

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
});
