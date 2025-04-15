import { createRoot } from 'react-dom/client';
import './main.css';
import { version } from './../../../package.json';
import Connector from '../ws-connector/ws-connector';
import '../../i18n';
import { useTranslation } from 'react-i18next';
// core styles are required for all packages
import '@mantine/core/styles.css';

// other css files are required only if
// you are using components from the corresponding package
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...
import {
    Text,
    Button,
    colorsTuple,
    createTheme,
    Group,
    MantineProvider,
    virtualColor,
} from '@mantine/core';

const theme = createTheme({
    colors: {
        primary: virtualColor({
            name: 'primary',
            dark: 'grape',
            light: 'grape',
        }),
        secondary: virtualColor({
            name: 'secondary',
            dark: 'cyan',
            light: 'cyan',
        }),
    },
});

function Main() {
    const { t } = useTranslation();
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Text>
                {t('StreamGlass')} <span>v{version}</span>
            </Text>
            <Connector />
        </MantineProvider>
    );
}

// TODO rm readix deps
function _Main() {
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
