import { Server, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import chalk from 'chalk';
import { handleMessage } from '../message-handler/message-handler.js';
import { generateClientId, State } from '../socket-state/socket-state.js';

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

/**
 * Creates and configures a new Socket.IO server using the provided HTTP server.
 * @param httpServer - The HTTP server to bind the Socket.IO server to.
 * @returns The configured Socket.IO server.
 */
export function createSocketServer(
    httpServer: HTTPServer,
    state: State
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
        const pairingId = generateClientId();
        state[pairingId] = {
            clients: [socket.id],
        };
        socket.emit('pairing-data', state[socket.id]);
        console.log(
            chalk.green(
                `Connection established with socket ${socket.id}`,
                JSON.stringify(state, null, 2)
            )
        );
        handleConnection(socket, state);
    });

    return io;
}

function addClientViaPairingCode(
    state: State,
    pairingCode: string,
    clientId: string
): boolean {
    // The pairing is initialized by an arbitrary client.
    // Each client received a pairing id that can be used to
    // establish a bi-directional communication between clients
    // proxied by the server.
    for (const socketId in state) {
        const stateEntry = state[socketId];
        if (
            typeof stateEntry === 'object' &&
            stateEntry !== null &&
            'pairingCode' in stateEntry &&
            'clients' in stateEntry &&
            Array.isArray(stateEntry.clients) &&
            stateEntry.pairingCode === pairingCode
        ) {
            stateEntry.clients.push(clientId);
            return true;
        }
    }
    return false;
}

/**
 * Handles a new client connection to the Socket.IO server.
 * @param socket - The connected socket.
 */
export function handleConnection(socket: Socket, state: State): void {
    socket.on('disconnect', (reason) => {
        delete state[socket.id];
        console.log(
            chalk.yellow(
                `Disconnected from ${socket.id} with reason: ${reason}`,
                JSON.stringify(state, null, 2)
            )
        );
    });

    socket.on('pairing-data', (data) => {
        console.log(
            chalk.white(
                `Received pairing-data from ${socket.id}:`,
                JSON.stringify(data, null, 2)
            )
        );
        const { pairingCode, socketId: clientId } = data;
        const isSuccess = addClientViaPairingCode(state, pairingCode, clientId);
        if (!isSuccess) {
            chalk.yellow(
                console.warn(`Could not pair ${clientId} via ${pairingCode}`)
            );
        } else {
            chalk.green(
                console.warn(
                    `Paired ${clientId} via ${pairingCode}`,
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
