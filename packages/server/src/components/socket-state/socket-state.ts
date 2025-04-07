/**
 * @module connectionState
 */

import { v7 as uuidv7 } from 'uuid';

export type ClientId = string;
export type ConnectionId = string;

export type Pairing = {
    clients: string[];
};

// Whatever shape your state has
export type State = { [pairingCode: string]: Pairing };

export function State() {
    return {} as State;
}

/**
 * Creates a new empty connection state.
 */
export function createState(): State {
    const emptyState: State = {}; // totally fine
    return emptyState;
}

/**
 * Generates a valid UUID to be used as a client ID.
 * @returns {ClientId} - A new UUID string.
 */
export function generateClientId(): ClientId {
    return uuidv7();
}
