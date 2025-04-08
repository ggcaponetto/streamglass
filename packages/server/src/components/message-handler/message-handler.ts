import chalk from 'chalk';
import { Socket, DefaultEventsMap, Server } from 'socket.io';
import type { State as StateType } from 'sg-utilities';

export function handleMessage(
    data: unknown,
    socket: Socket<
        DefaultEventsMap,
        DefaultEventsMap,
        DefaultEventsMap,
        unknown
    >,
    state: StateType
) {
    console.log(
        chalk.white(
            `Got data from ${socket.id}: `,
            JSON.stringify({
                data,
                state,
            })
        )
    );
    const promises: Promise<unknown>[] = [];
    // traverse all pairin channels and emit a message to all clients
    for (const pairingCode in state) {
        state[pairingCode].clients.forEach((clientId) => {
            // don't send the messages to unpaired clients
            if (state[pairingCode].clients.length <= 1) {
                return;
            }
            // don't send the messages to the original sender (himself)
            if (clientId === socket.id) {
                return;
            }
            console.log(
                chalk.blue(
                    `Sending message to paired client ${clientId} via ${pairingCode} channel`,
                    data
                )
            );
            const io = socket.nsp.server as Server;
            const pairedSocket = io.sockets.sockets.get(clientId);
            if (pairedSocket) {
                promises.push(
                    new Promise((res, rej) => {
                        pairedSocket.emit(
                            'data',
                            data,
                            (err: Error | null, result: unknown) => {
                                console.log(
                                    chalk.green(
                                        `Received message aknowledgment from paired client ${clientId} via ${pairingCode} channel: \n ${JSON.stringify(
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
