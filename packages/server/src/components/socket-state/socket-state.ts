/**
 * @module connectionState
 */

import { v7 as uuidv7 } from 'uuid';

export type ClientId = string;
export type ConnectionId = string;

// Whatever shape your state has
export type State = { [key: string]: unknown };

// Constructor signature
export interface StateConstructor {
    new (): State;
}

// Function with 'this' type
export function StateImpl(this: State) {
    this.state = createState();
    return this.state;
}

// Tell TypeScript that `StateImpl` can be called with `new`
export const State: StateConstructor = StateImpl as unknown as StateConstructor;

/**
 * Creates a new empty connection state.
 */
export function createState(): State {
    return {};
}

/**
 * Generates a valid UUID to be used as a client ID.
 * @returns {ClientId} - A new UUID string.
 */
export function generateClientId(): ClientId {
    return uuidv7();
}
