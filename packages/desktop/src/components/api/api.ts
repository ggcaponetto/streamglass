const { ipcRenderer } = window.electron;

async function invokeCommand(){
    const result = await ipcRenderer.invoke?.(
        'sg-event',
        {
            message:
                'This is a message from the renderer',
        }
    );
    console.log(
        'Reveived a response from the event-handler (onClick): ',
        result
    );
}

export { invokeCommand };