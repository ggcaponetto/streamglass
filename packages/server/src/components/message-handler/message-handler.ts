import chalk from 'chalk';
import { Socket, DefaultEventsMap } from 'socket.io';
import { State } from '../socket-state/socket-state.js';

export async function handleMessage(
    data: unknown,
    socket: Socket<
        DefaultEventsMap,
        DefaultEventsMap,
        DefaultEventsMap,
        unknown
    >,
    state: State,
    done: () => unknown
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
    // traverse all the state and emit messages to the paired socket
    for (const socketId in state) {
        if (socket.id === socketId) {
            // TODO
        }
    }

    // do some async stuff
    await new Promise((res, rej) => {
        try {
            setTimeout(() => {
                const echoMessage = `Echo back: ${JSON.stringify(data)}`;
                socket.emit('data', echoMessage);
                done();
                res(echoMessage);
            }, 200);
        } catch (e) {
            rej(new Error(`Error handling data from ${socket.id}: ${e}`));
        }
    });
}
