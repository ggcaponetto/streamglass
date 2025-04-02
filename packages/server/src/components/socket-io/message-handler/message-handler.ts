import chalk from 'chalk';
import { Socket, DefaultEventsMap } from 'socket.io';

export async function handleMessage(
    data: unknown,
    socket: Socket<
        DefaultEventsMap,
        DefaultEventsMap,
        DefaultEventsMap,
        unknown
    >,
    done: () => unknown
) {
    console.log(
        chalk.white(`Got data from ${socket.id}`, JSON.stringify(data))
    );
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
