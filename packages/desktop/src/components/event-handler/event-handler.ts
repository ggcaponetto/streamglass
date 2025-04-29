import { ipcMain } from 'electron';
import { spawn } from 'child_process';

function runCommand(commandString: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const child = spawn('node', ['-e', commandString], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr: null, exitCode: code });
            } else {
                reject({ stdout, stderr, exitCode: code });
            }
        });
    });
}

export function registerEventHandler(channel: string) {
    console.log(`Registering event handler on channel "${channel}".`);
    const handle = ipcMain.handle('sg-event', async (event, ...args) => {
        console.log(
            `Got event on channel "${channel}" (registerEventHandler): `,
            JSON.stringify({ args })
        );
        const data = args[0];
        const commandString = data[0];
        return new Promise((res, rej) => {
            try {
                const output: unknown[] = [];
                // Override console.log
                const originalLog = console.log;
                console.log = (...args) => {
                    output.push(args.join(' ')); // capture logs as strings
                    originalLog.apply(console, args); // still print to terminal if you want
                };
                const result = eval(commandString);
                // Restore console.log
                console.log = originalLog;

                res({
                    message: `Event "${channel}" handled by OS.`,
                    args,
                    commandString,
                    result,
                    output,
                });
                /* runCommand(commandString)
                .then(({ stdout, stderr, exitCode }) => {
                  res({
                    message: `Event "${channel}" handled by OS.`,
                    args,
                    commandString,
                    output: stdout.trim(),
                    error: stderr.trim(),
                    exitCode
                  });
                })
                .catch(({ stdout, stderr, exitCode }) => {
                  res({
                    message: `Error handling event "${channel}".`,
                    args,
                    commandString,
                    output: stdout.trim(),
                    error: stderr.trim(),
                    exitCode
                  });
                }); */
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
