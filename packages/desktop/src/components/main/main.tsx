import { createRoot } from 'react-dom/client'
import './main.css'
import { version } from './../../../package.json'
const { ipcRenderer } = window.electron

const root = createRoot(document.getElementById('root'))
root.render(
    <div
        className="main-container"
        style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <h2 style={{ textAlign: 'center' }}>Welcome to StreamGlass</h2>
        <div>{version}</div>
        <button
            onClick={async () => {
                const result = await ipcRenderer.invoke?.('sg-event', {
                    message: 'This is a message from the renderer',
                })
                console.log(result)
            }}
        >
            invoke command
        </button>
    </div>
)
