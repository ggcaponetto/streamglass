import { describe, it, expect } from 'vitest';
import { EventTypes } from './event-types.js';

describe('EventTypes enum', () => {
    it('should have correct values', () => {
        expect(EventTypes.PairingOffer).toBe('pairing-offer');
        expect(EventTypes.PairingRequest).toBe('pairing-request');
    });
});
