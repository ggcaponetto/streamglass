import { createRoot } from 'react-dom/client'
import './main.css'
import { version } from './../../../package.json'
import '@radix-ui/themes/styles.css'
import { Flex, Text, Button, Theme, Box } from '@radix-ui/themes'
import Connector from '../ws-connector/ws-connector'

const { ipcRenderer } = window.electron

const root = createRoot(document.getElementById('root'))
root.render(
    <Theme appearance="dark">
        <Flex
            direction="column"
            gap="2"
            align={'center'}
            justify={'center'}
            style={{ height: '100%' }}
        >
            <Flex direction={'column'}>
                <Text align={'center'} size={'5'}>
                    StreamGlass <Text size={'1'}>v{version}</Text>
                </Text>
                <Connector />
                <Button
                    onClick={async () => {
                        const result = await ipcRenderer.invoke?.('sg-event', {
                            message: 'This is a message from the renderer',
                        })
                        console.log(
                            'Reveived a response from the event-handler: ',
                            result
                        )
                    }}
                >
                    invoke command
                </Button>
            </Flex>
        </Flex>
    </Theme>
)
