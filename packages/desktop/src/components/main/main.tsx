import { createRoot } from 'react-dom/client'
import './main.css'
import { version } from './../../../package.json'
import "@radix-ui/themes/styles.css";
import { Flex, Text, Button, Theme } from "@radix-ui/themes";


const { ipcRenderer } = window.electron

const root = createRoot(document.getElementById('root'))
root.render(
    <Theme appearance="dark">
        <Flex direction="column" gap="2">
        <Text style={{ textAlign: 'center' }} size={"5"}>Welcome to StreamGlass</Text>
        <Text weight="light" size={"2"}>{version}</Text>
            <Button
                onClick={async () => {
                    const result = await ipcRenderer.invoke?.('sg-event', {
                        message: 'This is a message from the renderer',
                    })
                    console.log("Reveived a response from the event-handler: ", result)
                }}
            >
                invoke command
            </Button>
        </Flex>
    </Theme>
)
