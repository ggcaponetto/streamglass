import { createRoot } from 'react-dom/client';
import './main.css';
import { version } from './../../../package.json';
import '@radix-ui/themes/styles.css';
import { Flex, Text, Theme, Container, Box } from '@radix-ui/themes';
import Connector from '../ws-connector/ws-connector';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import { Toast } from 'radix-ui';
import './global-toast.css';

function Main() {
    const { t } = useTranslation();
    return (
        <Theme style={{ height: '100%' }} appearance="dark" accentColor="plum">
            <Toast.Provider duration={5000}>
                <Container
                    style={{
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    size="1"
                >
                    <Box p="2">
                        <Flex flexGrow={'1'} direction={'column'}>
                            <Text align={'center'} size={'5'}>
                                {t('StreamGlass')}{' '}
                                <Text size={'1'}>v{version}</Text>
                            </Text>
                            <Connector />
                        </Flex>
                    </Box>
                </Container>
                <div style={{ position: 'fixed', bottom: '0', right: '0' }}>
                    <Box p="2">
                        <Toast.Viewport />
                    </Box>
                </div>
            </Toast.Provider>
        </Theme>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
