import chalk from 'chalk';
import { Socket, DefaultEventsMap, Server } from 'socket.io';
import type { SocketData, State as StateType } from 'sg-utilities';

export function handleMessage(
    socketData: SocketData,
    socket: Socket<
        DefaultEventsMap,
        DefaultEventsMap,
        DefaultEventsMap,
        unknown
    >,
    state: StateType
) {
    console.log(chalk.white(`Got data from ${socket.id}: `));
    const { data, pairingCode, targetClientTypes } = socketData;
    const promises: Promise<unknown>[] = [];
    if (!state[pairingCode]) {
        console.log(
            chalk.yellow(`No paired clients found for ${pairingCode} channel`)
        );
    } else {
        state[pairingCode].clients.forEach((client) => {
            const { socketId, type } = client;
            if (targetClientTypes.includes(type) === false) {
                return;
            }
            console.log(
                chalk.blue(
                    `Sending message to paired client ${socketId} via ${pairingCode} channel`
                )
            );
            const io = socket.nsp.server as Server;
            const pairedSocket = io.sockets.sockets.get(socketId);
            if (pairedSocket) {
                promises.push(
                    new Promise((res, rej) => {
                        pairedSocket.emit(
                            'data',
                            data,
                            (err: Error | null, result: unknown) => {
                                console.log(
                                    chalk.green(
                                        `Received message aknowledgment from paired client ${socketId} via ${pairingCode} channel: \n ${JSON.stringify(
                                            {
                                                err,
                                                result,
                                            },
                                            null,
                                            2
                                        )}`
                                    )
                                );
                                if (err) {
                                    rej(err);
                                } else {
                                    res(result);
                                }
                            }
                        );
                    })
                );
            }
        });
    }
    return promises;
}
