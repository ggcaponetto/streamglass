// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer, shell } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel: string, data: any) => {
            console.log(`Called 'send' on channel ${channel} with data:`, data);
            return ipcRenderer.send(channel, data);
        },
        // eslint-disable-next-line no-unused-vars
        on: (channel: string, listener: (...args: any[]) => void) => {
            console.log(
                `Called 'on' on channel ${channel} with listener:`,
                listener
            );
            return ipcRenderer.on(channel, listener);
        },
        invoke: (channel: string, data: any) => {
            console.log(
                `Called 'invoke' on channel ${channel} with data:`,
                data
            );
            return ipcRenderer.invoke(channel, data);
        },
    },
    openExternal: (url: string) => {
        console.log('[preload] opening external URL:', url);
        shell.openExternal(url);
    },
});
