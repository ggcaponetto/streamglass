import { createRoot } from 'react-dom/client';
import './main.css';
import { version } from './../../../package.json';
import Connector from '../ws-connector/ws-connector';
import '../../i18n';
import { useTranslation } from 'react-i18next';
import '@mantine/core/styles.css';
// other css files are required only if
// you are using components from the corresponding package
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...
import {
    Text,
    createTheme,
    Group,
    MantineProvider,
    virtualColor,
    AppShell,
    Box,
    Burger,
    Title,
    Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Flex } from '@radix-ui/themes';
import SGIcon from '../../../src/assets/logo/logo-transparent.svg';
const ipcRenderer = window.electron.ipcRenderer;
const openExternal = window.electron.openExternal;

const theme = createTheme({
    colors: {
        primary: virtualColor({
            name: 'primary',
            dark: 'pink',
            light: 'pink',
        }),
        secondary: virtualColor({
            name: 'secondary',
            dark: 'blue',
            light: 'blue',
        }),
    },
});

function Main() {
    const [opened, { toggle }] = useDisclosure();
    const { t } = useTranslation();
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <AppShell
                padding="md"
                header={{ height: 40 }}
                navbar={{
                    width: 200,
                    breakpoint: 'sm',
                    collapsed: {
                        desktop: !opened,
                    },
                }}
            >
                <AppShell.Header>
                    <Group>
                        <Flex direction={'column'} align={'center'}>
                            <Box m={2}>
                                <Burger
                                    opened={opened}
                                    onClick={toggle}
                                    aria-label="Toggle navigation"
                                />
                            </Box>
                        </Flex>
                        <Box>
                            <Group>
                                <Title order={1} size={'h5'}>
                                    {t('StreamGlass')}
                                </Title>
                                <Flex
                                    direction={'column'}
                                    align={'center'}
                                    justify={'center'}
                                >
                                    <img
                                        style={{ display: 'flex' }}
                                        src={SGIcon}
                                        alt="StreamGlass icon"
                                        width={25}
                                        height={25}
                                    />
                                </Flex>
                                <Text size="sm">v{version}</Text>
                            </Group>
                        </Box>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar>
                    <Box m={8}>
                        <Menu>
                            <Menu.Item
                                onClick={async () => {
                                    try {
                                        await openExternal(
                                            'https://docs.streamglass.io'
                                        );
                                    } catch (e) {
                                        console.error(
                                            'Could not open external URL.',
                                            e
                                        );
                                    }
                                }}
                            >
                                Help
                            </Menu.Item>
                        </Menu>
                    </Box>
                </AppShell.Navbar>
                <AppShell.Main>
                    <Connector />
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<Main />);
