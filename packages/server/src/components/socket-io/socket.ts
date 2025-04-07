import { Server, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import chalk from 'chalk';
import { handleMessage } from '../message-handler/message-handler.js';
import { generateClientId, State } from '../socket-state/socket-state.js';
import type {
    PairingOffer,
    PairingRequest,
    State as StateType,
    ClientId,
} from 'sg-utilities';
import { EventTypes } from 'sg-utilities/src/constants/event-types.js';

/**
 * Validates required environment variables for the Socket.IO server.
 * Throws an error if any are missing.
 */
export function validateEnv(): void {
    if (!process.env.SERVER_SOCKET_IO_PORT) {
        throw new Error('Please specify a SERVER_SOCKET_IO_PORT env variable.');
    }
    if (!process.env.VITE_DESKTOP_ORIGIN) {
        throw new Error('Please specify a VITE_DESKTOP_ORIGIN env variable.');
    }
    if (!process.env.VITE_FRONTEND_ORIGIN) {
        throw new Error('Please specify a VITE_FRONTEND_ORIGIN env variable.');
    }
}

/**
 * Parses and returns the port number from environment variables.
 * @returns The port number to start the server on.
 */
export function getPort(): number {
    validateEnv();
    return parseInt(process.env.SERVER_SOCKET_IO_PORT || '', 10);
}

/**
 * Creates and returns a new HTTP server instance.
 * @returns A new Node.js HTTP server.
 */
export function createHttpServer(): HTTPServer {
    return createServer();
}

export function sendPairingOffer(
    pairingId: string,
    socket: Socket,
    state: StateType
): void {
    const pairingOffer: PairingOffer = {
        pairingCode: pairingId,
        pairingData: state[pairingId],
    };
    socket.emit(EventTypes.PairingOffer, pairingOffer);
}

export function openPairingChannel(state: StateType, socket: Socket): string {
    const pairingId = generateClientId();
    state[pairingId] = {
        clients: [socket.id],
    };
    return pairingId;
}

export function closePairingChannel(
    state: StateType,
    pairingId: string
): string {
    delete state[pairingId];
    return pairingId;
}

/**
 * Creates and configures a new Socket.IO server using the provided HTTP server.
 * @param httpServer - The HTTP server to bind the Socket.IO server to.
 * @returns The configured Socket.IO server.
 */
export function createSocketServer(
    httpServer: HTTPServer,
    state: StateType
): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                process.env.VITE_FRONTEND_ORIGIN?.toString() || null,
                process.env.VITE_DESKTOP_ORIGIN?.toString() || null,
            ].filter((origin) => origin !== null),
        },
    });

    io.on('connection', (socket) => {
        const pairingId = openPairingChannel(state, socket);
        console.log(
            chalk.green(
                `Connection established with socket ${socket.id}`,
                JSON.stringify(state, null, 2)
            )
        );
        sendPairingOffer(pairingId, socket, state);
        handleConnection(socket, state, pairingId);
    });

    return io;
}

function pair(
    state: StateType,
    pairingCode: string,
    socket: Socket
): StateType['pairingCode'] {
    state[pairingCode].clients.push(socket.id as ClientId);
    return state[pairingCode];
}

function unpair(
    state: StateType,
    pairingCode: string,
    socket: Socket
): StateType['pairingCode'] {
    console.log(
        chalk.yellow(
            `Unpairing ${socket.id} from ${pairingCode} channel`,
            JSON.stringify(state, null, 2)
        )
    );
    state[pairingCode].clients = state[pairingCode].clients.filter(
        (socketId: string) => socketId !== socket.id
    );
    console.log(
        chalk.yellow(
            `Unpaired ${socket.id} from ${pairingCode} channel`,
            JSON.stringify(state, null, 2)
        )
    );
    return state[pairingCode];
}

/**
 * Handles a new client connection to the Socket.IO server.
 * @param socket - The connected socket.
 */
export function handleConnection(
    socket: Socket,
    state: StateType,
    pairingCode: string
): void {
    socket.on('disconnect', (reason) => {
        unpair(state, pairingCode, socket);
        closePairingChannel(state, pairingCode);
        console.log(
            chalk.yellow(
                `Disconnected from ${socket.id} with reason: ${reason}`,
                JSON.stringify(state, null, 2)
            )
        );
    });

    // the server receives a pairing request from the client
    socket.on(EventTypes.PairingRequest, (data: PairingRequest) => {
        console.log(
            chalk.white(
                `Received pairing request from ${socket.id} for channel "${data.pairingCode}"`,
                JSON.stringify(data, null, 2)
            )
        );
        const isSuccess = pair(state, data.pairingCode, socket);
        if (!isSuccess) {
            chalk.yellow(
                console.warn(
                    `Could not pair ${socket.id} over ${data.pairingCode} channel`
                )
            );
        } else {
            chalk.green(
                console.warn(
                    `Paired ${socket.id} over ${data.pairingCode} channel`,
                    JSON.stringify(state, null, 2)
                )
            );
        }
    });

    socket.on('data', async (data) => {
        const start = Date.now();
        const res = await handleMessage(data, socket, state, () => {
            console.log(chalk.white(`Message sent by ${socket.id} handled.`));
        });
        const duration = Date.now() - start;
        console.log(
            chalk.white(
                `Handled data sent by ${socket.id} in ${duration}ms`,
                res
            )
        );
    });
}

/**
 * Starts the Socket.IO server by binding it to the given port.
 * @param io - The Socket.IO server instance.
 * @param port - The port number to listen on.
 */
export function startServer(): void {
    const state = State();
    console.log(chalk.white('Created state', JSON.stringify(state, null, 2)));

    // Entry point logic
    validateEnv();
    const port = getPort();
    const httpServer = createHttpServer();
    const io = createSocketServer(httpServer, state);
    io.listen(port);

    console.log(chalk.blue(`Socket.IO server listening on port ${port}`));
}
