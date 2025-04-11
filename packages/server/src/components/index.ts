import { startServer } from './socket-io/socket.js';
import { checkRequiredEnvVars } from 'sg-utilities/check-envs';

checkRequiredEnvVars([
    'SERVER_SOCKET_IO_PORT',
    'VITE_FRONTEND_ORIGIN',
    'VITE_DESKTOP_ORIGIN',
    'VITE_SERVER_URL',
    'ENABLE_COVERAGE_TRESHOLD',
]);
startServer();
