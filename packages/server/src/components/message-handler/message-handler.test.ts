import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { handleMessage } from './message-handler.js';
import type { Socket } from 'socket.io';
import { ClientTypes } from 'sg-utilities';

describe('handleMessage', () => {
    let mockEmit: ReturnType<typeof vi.fn>;
    let mockSocket: Partial<Socket>;

    beforeEach(() => {
        vi.useFakeTimers();
        mockEmit = vi.fn();
        mockSocket = {
            id: 'abc123',
            emit: mockEmit,
        };

        // Silence console.log and make it spy-able
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    });

    it('return empty array if there is no paired client', async () => {
        const data = {
            pairingCode: 'testPairingCode',
            targetClientTypes: [ClientTypes.Desktop],
            data: { foo: 'bar' },
        };
        const mockState = {
            testPairingCode: {
                clients: [],
            },
        };
        const promises = handleMessage(data, mockSocket as Socket, mockState);

        // Simulate timeout delay
        vi.advanceTimersByTime(200);
        const res = await Promise.all(promises);

        expect(res).toEqual([]);
    });
});
