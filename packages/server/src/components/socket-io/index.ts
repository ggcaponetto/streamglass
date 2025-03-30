import {
    validateEnv,
    getPort,
    createHttpServer,
    createSocketServer,
    startServer,
} from './socket.js'

// Entry point logic
validateEnv()
const port = getPort()
const httpServer = createHttpServer()
const io = createSocketServer(httpServer)
startServer(io, port)
