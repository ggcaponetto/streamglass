import {
    createState,
    createConnection,
    addClient,
    removeClient,
    closeConnection,
    serializeState,
    deserializeState,
    generateClientId,
} from './socket-state.js'

import { describe, it, expect } from 'vitest'
import { v7 as uuidv7, validate as uuidValidate } from 'uuid'

describe('Connection State Module', () => {
    it('creates an empty state', () => {
        const state = createState()
        expect(state).toEqual({})
    })

    it('creates a new connection', () => {
        const connId = uuidv7()
        const state = createConnection(createState(), connId)
        expect(state[connId]).toBeDefined()
        expect(state[connId] instanceof Set).toBe(true)
    })

    it('does not overwrite existing connection', () => {
        const connId = uuidv7()
        const baseState = createConnection(createState(), connId)
        const newState = createConnection(baseState, connId)
        expect(newState).toEqual(baseState)
    })

    it('adds a valid client to a connection', () => {
        const connId = uuidv7()
        const clientId = generateClientId()
        const stateWithConn = createConnection(createState(), connId)
        const stateWithClient = addClient(stateWithConn, connId, clientId)
        expect(stateWithClient[connId].has(clientId)).toBe(true)
    })

    it('throws when adding an invalid clientId', () => {
        const connId = uuidv7()
        const invalidClientId = 'invalid-uuid'
        const state = createConnection(createState(), connId)
        expect(() => addClient(state, connId, invalidClientId)).toThrow()
    })

    it('removes a client from a connection', () => {
        const connId = uuidv7()
        const clientId = generateClientId()
        const state1 = createConnection(createState(), connId)
        const state2 = addClient(state1, connId, clientId)
        const state3 = removeClient(state2, connId, clientId)
        expect(state3[connId].has(clientId)).toBe(false)
    })

    it('closes a connection', () => {
        const connId = uuidv7()
        const state = createConnection(createState(), connId)
        const closed = closeConnection(state, connId)
        expect(closed[connId]).toBeUndefined()
    })

    it('serializes and deserializes the state', () => {
        const connId = uuidv7()
        const clientId1 = generateClientId()
        const clientId2 = generateClientId()
        let state = createConnection(createState(), connId)
        state = addClient(state, connId, clientId1)
        state = addClient(state, connId, clientId2)
        const serialized = serializeState(state)
        const restored = deserializeState(
            serialized as Record<string, string[]>
        )
        expect(restored[connId].has(clientId1)).toBe(true)
        expect(restored[connId].has(clientId2)).toBe(true)
    })

    it('generates a valid UUID v7 as clientId', () => {
        const clientId = generateClientId()
        expect(uuidValidate(clientId)).toBe(true)
    })
})

describe('Edge cases for serialization and deserialization', () => {
    it('serializeState should handle empty state', () => {
        const state = createState()
        const serialized = serializeState(state)
        expect(serialized).toEqual({})
    })

    it('deserializeState should handle empty object', () => {
        const deserialized = deserializeState({})
        expect(deserialized).toEqual({})
    })

    it('deserializeState should convert string arrays to sets', () => {
        const connectionId = uuidv7()
        const clientIds = ['a', 'b', 'c']
        const input = {
            [connectionId]: clientIds,
        }
        const deserialized = deserializeState(input)
        expect(deserialized[connectionId]).toBeInstanceOf(Set)
        expect([...deserialized[connectionId]]).toEqual(clientIds)
    })
})
