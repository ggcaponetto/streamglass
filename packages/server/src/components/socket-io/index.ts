import { Server } from "socket.io";
import chalk from 'chalk';
import { createServer } from "http";

if(process.env.SERVER_SOCKET_IO_PORT === undefined){
    throw new Error("Please specify a SERVER_SOCKET_IO_PORT env variable.")
}
if(process.env.SERVER_CLIENT_ORIGIN === undefined){
    throw new Error("Please specify a SERVER_CLIENT_ORIGIN env variable.")
}
const PORT = parseInt(process.env.SERVER_SOCKET_IO_PORT, 10);

console.log(chalk.blue(`Starting socket-io server on port ${PORT}`));

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SERVER_CLIENT_ORIGIN
  }
});

io.on("connection", (socket) => {
    console.log(chalk.green('Connection established', socket.id));
    socket.on("disconnect", (reason) => {
        console.log(chalk.yellow(`Disconnected from ${socket.id}`, JSON.stringify({
            reason
        })));
    });
    socket.on("data", (data) => {
        console.log(chalk.white(`Got data from ${socket.id}`, JSON.stringify(data)));
            // Echo the data back to the same socket
        socket.emit("data", `Echo back: ${JSON.stringify(data)}`);
    });
});

io.listen(PORT);