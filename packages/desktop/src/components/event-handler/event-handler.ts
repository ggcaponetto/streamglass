import { ipcMain } from 'electron';

export function registerEventHandler(channel: string) {
    console.log(`Registering event handler on channel "${channel}".`);
    const handle = ipcMain.handle('sg-event', async (...args) => {
        console.log(
            `Got event on channel "${channel}" (registerEventHandler):\n\n`,
            args
        );
        return new Promise((res, rej) => {
            try {
                res({
                    message: `Event "${channel}" handled by OS.`,
                });
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
