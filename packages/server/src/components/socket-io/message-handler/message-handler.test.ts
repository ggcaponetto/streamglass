import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { handleMessage } from './message-handler.js';
import type { Socket } from 'socket.io';

describe('handleMessage', () => {
    let mockEmit: ReturnType<typeof vi.fn>;
    let mockDone: ReturnType<typeof vi.fn>;
    let mockSocket: Partial<Socket>;

    beforeEach(() => {
        vi.useFakeTimers();
        mockEmit = vi.fn();
        mockDone = vi.fn();
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

    it('should log data, emit echoed data, and call done()', async () => {
        const data = { foo: 'bar' };

        const promise = handleMessage(data, mockSocket as Socket, mockDone);

        // Simulate timeout delay
        vi.advanceTimersByTime(200);
        await promise;

        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining('Got data from abc123 {"foo":"bar"}')
        );

        expect(mockEmit).toHaveBeenCalledWith(
            'data',
            'Echo back: {"foo":"bar"}'
        );
        expect(mockDone).toHaveBeenCalled();
    });
});
