import { ipcMain } from 'electron';

export function registerEventHandler(channel: string) {
    console.log(`Registering event handler on channel "${channel}".`);
    const handle = ipcMain.handle('sg-event', async (event, ...args) => {
        console.log(
            `Got event on channel "${channel}" (registerEventHandler): `,
            JSON.stringify({ args })
        );
        return new Promise((res, rej) => {
            try {
                setTimeout(() => {
                    res({
                        message: `Event "${channel}" handled by OS with a 2s delay.`,
                        args,
                    });
                }, 2000);
            } catch (e) {
                rej(
                    new Error(
                        `Something wrong happened while handling an "${channel}" event: ${e.message}`
                    )
                );
            }
        });
    });
    return handle;
}

export function removeEventHandler(channel: string) {
    console.log(`Removing event handler on channel "${channel}".`);
    return ipcMain.removeHandler(channel);
}
