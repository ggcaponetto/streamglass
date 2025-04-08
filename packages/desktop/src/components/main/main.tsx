import { createRoot } from 'react-dom/client';
import './main.css';
import packageJson from './../../../package.json' with { type: 'json' };
import '@radix-ui/themes/styles.css';
import { Flex, Text, Button, Theme, Container } from '@radix-ui/themes';
import Connector from '../ws-connector/ws-connector.js';
import '../../i18n';
import { useTranslation } from 'react-i18next';

const { ipcRenderer } = window.electron;

function Main() {
    const { t } = useTranslation();
    return (
        <Theme style={{ height: '100%' }} appearance="dark" accentColor="plum">
            <Container
                style={{
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                size="1"
            >
                <Flex
                    flexGrow={'1'}
                    align={'center'}
                    justify={'center'}
                    direction={'column'}
                >
                    <Text align={'center'} size={'5'}>
                        {t('StreamGlass')} <Text size={'1'}>v{packageJson.version}</Text>
                    </Text>
                    <Connector />
                    <Button
                        style={{ width: '100%' }}
                        onClick={async () => {
                            const result = await ipcRenderer.invoke?.(
                                'sg-event',
                                {
                                    message:
                                        'This is a message from the renderer',
                                }
                            );
                            console.log(
                                'Reveived a response from the event-handler: ',
                                result
                            );
                        }}
                    >
                        {t('invoke-command')}
                    </Button>
                </Flex>
            </Container>
        </Theme>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
