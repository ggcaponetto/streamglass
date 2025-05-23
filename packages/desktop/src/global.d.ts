declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                send(channel: string, data?: any): void;
                invoke?(channel: string, data?: any): Promise<any>;
                on?(channel: string, func: (...args: any[]) => void): void;
            };
            openExternal: (...args: any[]) => any;
        };
    }
}

export {};
