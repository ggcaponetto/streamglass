// 👇 Always put this first
vi.mock('../message-handler/message-handler.js', () => {
    return {
        handleMessage: vi.fn(() => [Promise.resolve('response')]),
    };
});

import {
    getPort,
    createHttpServer,
    createSocketServer,
    handleConnection,
    openPairingChannel,
    sendPairingOffer,
    closePairingChannel,
    printState,
    startServer,
} from './socket.js';
import * as socketModule from './socket.js'; // For mocking startServer deps
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server as SocketIOServer } from 'socket.io';
import { State } from '../socket-state/socket-state.js';
import { EventTypes } from 'sg-utilities/constants/event-types';
import { ClientTypes } from 'sg-utilities';

describe('socketServer', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        vi.restoreAllMocks();
        process.env = { ...OLD_ENV };
        process.env.SERVER_SOCKET_IO_PORT = '4000';
        process.env.VITE_FRONTEND_ORIGIN = 'http://localhost:5173';
        process.env.VITE_DESKTOP_ORIGIN = 'http://localhost:5174';
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

    describe('printState', () => {
        it('prints the state to console', () => {
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            const state = { code: { clients: [] } };
            printState(state);
            expect(logSpy).toHaveBeenCalled();
        });
    });

    describe('openPairingChannel', () => {
        it('adds a pairing channel to state', () => {
            const state = State();
            const socket = { id: 'abc123' };
            const code = openPairingChannel(state, socket);
            expect(code).toBeDefined();
            expect(state[code].clients).toEqual([
                { socketId: 'abc123', type: ClientTypes.Server },
            ]);
        });
    });

    describe('sendPairingOffer', () => {
        it('emits a pairing offer', () => {
            const socket = {
                emit: vi.fn(),
                id: 'abc',
            };
            const state = {
                someId: {
                    clients: [{ socketId: 'abc', type: ClientTypes.Server }],
                },
            };
            sendPairingOffer('someId', socket, state);
            expect(socket.emit).toHaveBeenCalledWith(
                EventTypes.PairingOffer,
                expect.objectContaining({
                    pairingCode: 'someId',
                    state: { someId: state.someId },
                })
            );
        });
    });

    describe('closePairingChannel', () => {
        it('removes a channel from the state and logs it', () => {
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            const state = {
                testCode: {
                    clients: [],
                },
            };
            const result = closePairingChannel(state, 'testCode');
            expect(result).toBe('testCode');
            expect(state.testCode).toBeUndefined();
            expect(logSpy).toHaveBeenCalled();
        });
    });

    describe('createSocketServer', () => {
        it('creates a Socket.IO server and sets connection handler', () => {
            const httpServer = createHttpServer();
            const state = State();
            const io = createSocketServer(httpServer, state);
            expect(io).toBeInstanceOf(SocketIOServer);
        });
    });

    describe('handleConnection', () => {
        it('registers disconnect, data, and pairing handlers', () => {
            const socket = {
                id: 'abc123',
                on: vi.fn(),
                emit: vi.fn(),
            };
            const state = State();
            const pairingCode = 'testPairingCode';
            handleConnection(socket, state, pairingCode);
            expect(socket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
            expect(socket.on).toHaveBeenCalledWith('data', expect.any(Function));
            expect(socket.on).toHaveBeenCalledWith(EventTypes.PairingRequest, expect.any(Function));
        });

        it('logs and handles invalid and valid pairing requests', () => {
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const state = {
                knownCode: { clients: [] },
            };
            const socket = {
                id: 'socket123',
                on: vi.fn((event, cb) => {
                    if (event === EventTypes.PairingRequest) {
                        // Invalid pairing
                        cb({ pairingCode: 'invalidCode', type: ClientTypes.Frontend });
                        // Valid pairing
                        cb({ pairingCode: 'knownCode', type: ClientTypes.Desktop });
                    }
                }),
                emit: vi.fn(),
            };
            handleConnection(socket, state, 'someCode');
            expect(state.knownCode.clients.length).toBe(1);
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Could not pair'));
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Paired'));
            warnSpy.mockRestore();
        });

    });

    describe('startServer', () => {
        it('starts the server and logs output', () => {
            const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
            const mockHttpServer = {
                listen: vi.fn(),
            };
            const mockSocketServer = {
                listen: vi.fn(),
            };
            vi.spyOn(socketModule, 'createHttpServer').mockReturnValue(mockHttpServer);
            vi.spyOn(socketModule, 'createSocketServer').mockReturnValue(mockSocketServer);
            startServer();
            expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Socket.IO server listening'));
        });
    });
});
