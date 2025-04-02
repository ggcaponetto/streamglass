import { createState } from '../socket-state/socket-state.js';
import {
    validateEnv,
    getPort,
    createHttpServer,
    createSocketServer,
    startServer,
} from './socket.js';
import chalk from 'chalk';

// Entry point logic
validateEnv();
const port = getPort();
const httpServer = createHttpServer();
const io = createSocketServer(httpServer);
const state = createState();
chalk.white('Created state', state);

startServer(io, port);
