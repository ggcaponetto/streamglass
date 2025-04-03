import { Server, Socket } from 'socket.io';
import { createServer, Server as HTTPServer } from 'http';
import chalk from 'chalk';
import { handleMessage } from '../message-handler/message-handler.js';
import { createState } from '../socket-state/socket-state.js';

/**
 * Validates required environment variables for the Socket.IO server.
 * Throws an error if any are missing.
 */
export function validateEnv(): void {
    if (!process.env.SERVER_SOCKET_IO_PORT) {
        throw new Error('Please specify a SERVER_SOCKET_IO_PORT env variable.');
    }
    if (!process.env.SERVER_CLIENT_ORIGIN) {
        throw new Error('Please specify a SERVER_CLIENT_ORIGIN env variable.');
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
export function createSocketServer(httpServer: HTTPServer): Server {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.SERVER_CLIENT_ORIGIN?.split(',').map((origin) =>
                origin.trim()
            ),
        },
    });

    io.on('connection', handleConnection);

    return io;
}

/**
 * Handles a new client connection to the Socket.IO server.
 * @param socket - The connected socket.
 */
export function handleConnection(socket: Socket): void {
    console.log(chalk.green('Connection established', socket.id));

    socket.on('disconnect', (reason) => {
        console.log(
            chalk.yellow(
                `Disconnected from ${socket.id}`,
                JSON.stringify({ reason })
            )
        );
    });

    socket.on('data', async (data) => {
        const start = Date.now();
        const res = await handleMessage(data, socket, () => {
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
export function startServer(io: Server, port: number): void {
    io.listen(port);
    console.log(chalk.blue(`Socket.IO server listening on port ${port}`));
    const state = createState();
    console.log(chalk.white('Created state', JSON.stringify(state, null, 2)));
}
