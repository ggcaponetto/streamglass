const { ipcRenderer } = window.electron;

async function invokeCommand() {
    const result = await ipcRenderer.invoke?.('sg-event', {
        message: 'This is a message from the renderer',
    });
    console.log(
        'Reveived a response from the event-handler (onClick): ',
        result
    );
}

async function openExternalUrl(url: string) {
    openExternal: (url: string) => {
        console.log('[preload] opening external URL:', url);
        shell.openExternal(url).catch((err) => {
            console.error('[preload] failed to open URL:', err);
        });
    },
}

export { invokeCommand };
