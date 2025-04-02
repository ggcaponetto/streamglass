/**
 * @module connectionState
 */

import { v7 as uuidv7, validate as uuidValidate } from 'uuid';

export type ClientId = string;
export type ConnectionId = string;

/**
 * The structure of the state mapping connection UUIDs to sets of client IDs.
 */
export interface ConnectionState {
    [connectionId: string]: Set<ClientId>;
}

/**
 * Creates a new empty connection state.
 * @returns {ConnectionState}
 */
export function createState(): ConnectionState {
    return {};
}

/**
 * Creates a new connection with no clients.
 * @param {ConnectionState} state - Current state.
 * @param {ConnectionId} connectionId - UUID for the new connection.
 * @returns {ConnectionState} - New state with the connection added.
 */
export function createConnection(
    state: ConnectionState,
    connectionId: ConnectionId
): ConnectionState {
    if (state[connectionId]) return state; // Avoid overwrite
    return {
        ...state,
        [connectionId]: new Set(),
    };
}

/**
 * Adds a client to an existing connection.
 * @param {ConnectionState} state - Current state.
 * @param {ConnectionId} connectionId - Target connection ID.
 * @param {ClientId} clientId - Client ID to add (must be a valid UUID).
 * @returns {ConnectionState} - New state with the client added.
 * @throws {Error} If the clientId is not a valid UUID.
 */
export function addClient(
    state: ConnectionState,
    connectionId: ConnectionId,
    clientId: ClientId
): ConnectionState {
    if (!uuidValidate(clientId)) {
        throw new Error(`Invalid clientId: ${clientId}`);
    }
    if (!state[connectionId]) return state;
    const newClients = new Set(state[connectionId]);
    newClients.add(clientId);
    return {
        ...state,
        [connectionId]: newClients,
    };
}

/**
 * Removes a client from a connection.
 * @param {ConnectionState} state - Current state.
 * @param {ConnectionId} connectionId - Target connection ID.
 * @param {ClientId} clientId - Client ID to remove.
 * @returns {ConnectionState} - New state with the client removed.
 */
export function removeClient(
    state: ConnectionState,
    connectionId: ConnectionId,
    clientId: ClientId
): ConnectionState {
    if (!state[connectionId]) return state;
    const newClients = new Set(state[connectionId]);
    newClients.delete(clientId);
    return {
        ...state,
        [connectionId]: newClients,
    };
}

/**
 * Closes (removes) a connection entirely.
 * @param {ConnectionState} state - Current state.
 * @param {ConnectionId} connectionId - ID of the connection to remove.
 * @returns {ConnectionState} - New state without the specified connection.
 */
export function closeConnection(
    state: ConnectionState,
    connectionId: ConnectionId
): ConnectionState {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [connectionId]: _, ...rest } = state;
    return rest;
}

/**
 * Serializes the current state into a JSON-compatible object.
 * @param {ConnectionState} state - Current state.
 * @returns {object} - Serialized version of the state.
 */
export function serializeState(state: ConnectionState): object {
    const serialized: Record<string, string[]> = {};
    for (const [connId, clients] of Object.entries(state)) {
        serialized[connId] = Array.from(clients);
    }
    return serialized;
}

/**
 * Deserializes a previously serialized state object.
 * @param {object} data - Serialized state.
 * @returns {ConnectionState} - Deserialized state.
 */
export function deserializeState(
    data: Record<string, string[]>
): ConnectionState {
    const state = {} as ConnectionState;
    for (const [connId, clients] of Object.entries(data)) {
        state[connId] = new Set(clients);
    }
    return state;
}

/**
 * Generates a valid UUID to be used as a client ID.
 * @returns {ClientId} - A new UUID string.
 */
export function generateClientId(): ClientId {
    return uuidv7();
}
