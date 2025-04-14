import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { handleMessage } from './message-handler.js';
import type { Socket, Server as SocketIOServer } from 'socket.io';
import { ClientTypes, type State, type SocketData } from 'sg-utilities';

vi.mock('chalk', async () => {
    const actual = await vi.importActual<typeof import('chalk')>('chalk');
    return {
        ...actual,
        white: (str: string) => str,
        yellow: (str: string) => str,
        blue: (str: string) => str,
        green: (str: string) => str,
    };
});

describe('handleMessage', () => {
    let mockSocket: Partial<Socket>;
    let mockServerSocketsGet: ReturnType<typeof vi.fn>;
    let mockPairedEmit: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        vi.useFakeTimers();

        mockServerSocketsGet = vi.fn();
        mockPairedEmit = vi.fn();

        const mockServer = {
            sockets: {
                sockets: {
                    get: mockServerSocketsGet,
                },
            },
        } as unknown as SocketIOServer;

        mockSocket = {
            id: 'abc123',
            nsp: {
                server: mockServer,
            },
        } as Partial<Socket>;

        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it('returns empty array if there are no paired clients', async () => {
        const socketData: SocketData = {
            pairingCode: 'code1',
            targetClientTypes: [ClientTypes.Desktop],
            data: { hello: 'world' },
        };

        const state: State = {
            code1: {
                clients: [],
            },
        };

        const promises = handleMessage(socketData, mockSocket as Socket, state);
        vi.advanceTimersByTime(100);
        const res = await Promise.all(promises);
        expect(res).toEqual([]);
    });

    it('returns empty array if no client matches targetClientTypes', async () => {
        const socketData: SocketData = {
            pairingCode: 'code2',
            targetClientTypes: [ClientTypes.Frontend],
            data: { foo: 'bar' },
        };

        const state: State = {
            code2: {
                clients: [{ socketId: 'x1', type: ClientTypes.Desktop }],
            },
        };

        const promises = handleMessage(socketData, mockSocket as Socket, state);
        vi.advanceTimersByTime(100);
        const res = await Promise.all(promises);
        expect(res).toEqual([]);
    });

    it('sends data to matched client and resolves on ack success', async () => {
        const socketData: SocketData = {
            pairingCode: 'code3',
            targetClientTypes: [ClientTypes.Desktop],
            data: { test: 1 },
        };

        mockPairedEmit.mockImplementation((_event, _data, ack) => {
            ack(null, 'ack-success');
        });

        mockServerSocketsGet.mockReturnValue({
            emit: mockPairedEmit,
        });

        const state: State = {
            code3: {
                clients: [{ socketId: 'socketX', type: ClientTypes.Desktop }],
            },
        };

        const promises = handleMessage(socketData, mockSocket as Socket, state);
        vi.advanceTimersByTime(100);
        const res = await Promise.all(promises);
        expect(res).toEqual(['ack-success']);
        expect(mockPairedEmit).toHaveBeenCalled();
    });

    it('rejects promise if ack returns an error', async () => {
        const socketData: SocketData = {
            pairingCode: 'code4',
            targetClientTypes: [ClientTypes.Desktop],
            data: { message: 'fail' },
        };

        const error = new Error('ack failed');

        mockPairedEmit.mockImplementation((_event, _data, ack) => {
            ack(error, null);
        });

        mockServerSocketsGet.mockReturnValue({
            emit: mockPairedEmit,
        });

        const state: State = {
            code4: {
                clients: [{ socketId: 'socketY', type: ClientTypes.Desktop }],
            },
        };

        const promises = handleMessage(socketData, mockSocket as Socket, state);
        vi.advanceTimersByTime(100);

        await expect(Promise.allSettled(promises)).resolves.toEqual([
            {
                status: 'rejected',
                reason: error,
            },
        ]);
    });

    it('does nothing if pairedSocket is not found', async () => {
        const socketData: SocketData = {
            pairingCode: 'code5',
            targetClientTypes: [ClientTypes.Desktop],
            data: { thing: 'x' },
        };

        mockServerSocketsGet.mockReturnValue(undefined);

        const state: State = {
            code5: {
                clients: [
                    { socketId: 'notFoundId', type: ClientTypes.Desktop },
                ],
            },
        };

        const promises = handleMessage(socketData, mockSocket as Socket, state);
        vi.advanceTimersByTime(100);
        const res = await Promise.all(promises);
        expect(res).toEqual([]);
        expect(mockPairedEmit).not.toHaveBeenCalled();
    });
});
