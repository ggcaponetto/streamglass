import './App.css';
import Connector from '../connector/Connector';
import { version } from '../../../package.json';
import { SGGrid } from '../grid/Grid';
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
    Center,
    Flex,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SGIcon from '../../../public/assets/logo/logo-transparent.svg';
import { Notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import '../../index.css';
// core styles are required for all packages
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// other css files are required only if
// you are using components from the corresponding package
// import '@mantine/dates/styles.css';
// import '@mantine/dropzone/styles.css';
// import '@mantine/code-highlight/styles.css';
// ...

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

function App() {
    const [opened, { toggle }] = useDisclosure();
    const { t } = useTranslation();
    return (
        <MantineProvider theme={theme} defaultColorScheme="dark">
            <Notifications />
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
                                onClick={() => {
                                    try {
                                        try {
                                            window.open(
                                                'https://docs.streamglass.io'
                                            );
                                        } catch (e) {
                                            console.error(
                                                'Could not open external URL.',
                                                {
                                                    window,
                                                    e,
                                                }
                                            );
                                        }
                                    } catch (e) {
                                        console.error(
                                            'Could not open external URL.',
                                            {
                                                window,
                                                e,
                                            }
                                        );
                                    }
                                }}
                            >
                                <Center>Help</Center>
                            </Menu.Item>
                        </Menu>
                    </Box>
                </AppShell.Navbar>
                <AppShell.Main>
                    v{version}
                    <Connector></Connector>
                    <SGGrid />
                </AppShell.Main>
            </AppShell>
        </MantineProvider>
    );
}

export default App;
