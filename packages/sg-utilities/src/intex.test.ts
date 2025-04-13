import { describe, it, expect } from 'vitest';
import { ClientTypes } from './index.js';

describe('ClientTypes enum', () => {
    it('should match expected values', () => {
        expect(ClientTypes.Desktop).toBe('Desktop');
        expect(ClientTypes.Frontend).toBe('Frontend');
        expect(ClientTypes.Server).toBe('Server');
    });
});
