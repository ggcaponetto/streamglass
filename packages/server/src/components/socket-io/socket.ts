import { Server, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import chalk from 'chalk';
import { handleMessage } from '../message-handler/message-handler.js';
import { generatePairingCode, State } from '../socket-state/socket-state.js';
import {
    type PairingOffer,
    type PairingRequest,
    type State as StateType,
    type SocketId,
    ClientTypes,
    Client,
} from 'sg-utilities';
import { EventTypes } from 'sg-utilities/constants/event-types';

export function printState(state: StateType): void {
    console.log('State: \n', JSON.stringify(state, null, 2));
}

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
        state: {
            [pairingId]: state[pairingId],
        },
    };
    socket.emit(EventTypes.PairingOffer, pairingOffer);
}

export function openPairingChannel(state: StateType, socket: Socket): string {
    const pairingId = generatePairingCode();
    state[pairingId] = {
        clients: [
            {
                socketId: socket.id,
                type: ClientTypes.Server,
            },
        ],
    };
    return pairingId;
}

export function closePairingChannel(
    state: StateType,
    pairingId: string
): string {
    delete state[pairingId];
    console.log(chalk.yellow(`Closed pairing channel ${pairingId}`));
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
    const corsOptions = {
        origin: [
            process.env.VITE_FRONTEND_ORIGIN?.toString() || null,
            process.env.VITE_DESKTOP_ORIGIN?.toString() || null,
        ].filter((origin) => origin !== null),
    };
    console.log(
        chalk.blue(
            `Starting socket server with cors options:\n ${JSON.stringify(corsOptions)}`
        )
    );
    const io = new Server(httpServer, {
        cors: corsOptions,
    });

    io.on('connection', (socket) => {
        const pairingId = openPairingChannel(state, socket);
        console.log(
            chalk.green(`Connection established with socket ${socket.id}`)
        );
        printState(state);
        sendPairingOffer(pairingId, socket, state);
        handleConnection(socket, state, pairingId, () => {
            printState(state);
        });
    });

    return io;
}

function pair(state: StateType, data: PairingRequest, socket: Socket): boolean {
    let isSuccess;
    const { pairingCode, type } = data;
    if (!state[pairingCode]) {
        console.error(
            chalk.red(
                `Error pairing ${socket.id} with ${pairingCode} channel. The channel does not exist.`
            )
        );
        isSuccess = false;
    } else {
        state[pairingCode].clients.push({
            socketId: socket.id as SocketId,
            type,
        });
        isSuccess = true;
    }
    return isSuccess;
}

function unpair(
    state: StateType,
    pairingCode: string,
    socket: Socket
): StateType['pairingCode'] {
    for (const pairingCode in state) {
        state[pairingCode].clients = state[pairingCode].clients.filter(
            (client: Client) => client.socketId !== socket.id
        );
        console.log(
            chalk.yellow(`Unpaired ${socket.id} from ${pairingCode} channel`)
        );
    }
    return state[pairingCode];
}

/**
 * Handles a new client connection to the Socket.IO server.
 * @param socket - The connected socket.
 */
export function handleConnection(
    socket: Socket,
    state: StateType,
    pairingCode: string,
    onSocketEvent?: (...args: unknown[]) => unknown // Optional callback for additional socket events
): void {
    socket.on('disconnect', (reason) => {
        unpair(state, pairingCode, socket);
        closePairingChannel(state, pairingCode);
        console.log(
            chalk.yellow(
                `Disconnected from ${socket.id} with reason: ${reason}`
            )
        );
        onSocketEvent?.();
    });

    // the server receives a pairing request from the client
    socket.on(EventTypes.PairingRequest, (data: PairingRequest) => {
        console.log(
            chalk.white(
                `Received pairing request from ${socket.id} for channel "${data.pairingCode}"`
            )
        );
        const isSuccess = pair(state, data, socket);
        if (!isSuccess) {
            chalk.yellow(
                console.warn(
                    `Could not pair ${socket.id} over ${data.pairingCode} channel`
                )
            );
        } else {
            chalk.green(
                console.warn(
                    `Paired ${socket.id} over ${data.pairingCode} channel`
                )
            );
        }
        onSocketEvent?.();
    });

    socket.on('data', async (data, callback) => {
        const start = Date.now();
        const promises = handleMessage(data, socket, state);
        const responses = await Promise.all(promises);
        const duration = Date.now() - start;
        console.log(
            chalk.white(
                `Message sent by ${socket.id} handled in ${duration}ms and got responses: ${JSON.stringify(responses)}`
            ),
            {
                data,
                responses,
                callback,
            }
        );
        if (callback) {
            callback(null, responses);
        }
        onSocketEvent?.();
    });
}

/**
 * Starts the Socket.IO server by binding it to the given port.
 * @param io - The Socket.IO server instance.
 * @param port - The port number to listen on.
 */
export function startServer(): void {
    const state = State();
    console.log(chalk.white('Created empty state.'));
    printState(state);

    // Entry point logic
    validateEnv();
    const port = getPort();
    const httpServer = createHttpServer();
    const io = createSocketServer(httpServer, state);
    io.listen(port);

    console.log(chalk.blue(`Socket.IO server listening on port ${port}`));
}
