import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { EventTypes } from 'sg-utilities/constants/event-types';
import { QRCodeSVG } from 'qrcode.react';
import { IconCircleFilled } from '@tabler/icons-react';
import {
    Text,
    Group,
    Box,
    Center,
    Flex,
    Stack,
    Anchor,
    Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const VITE_FRONTEND_ORIGIN = import.meta.env.VITE_FRONTEND_ORIGIN;

const ipcRenderer = window.electron.ipcRenderer;

export default function Connector() {
    const [isLoading, setIsLoading] = useState(false);
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [paringData, setParingData] = useState(null);
    const url = `${VITE_FRONTEND_ORIGIN}/?pairingCode=${paringData?.pairingCode}`;

    useEffect(() => {
        if (isConnected === false) {
            setParingData(null);
        }
    }, [isConnected]);

    useEffect(() => {
        console.log(`Connecting to ${VITE_SERVER_URL}`);
        setIsLoading(true);
        const socketInstance = io(VITE_SERVER_URL);
        socketInstance.on('connect', () => {
            console.log('connect');
            setIsConnected(true);
            setIsLoading(false);
            setError(null);
        });
        socketInstance.on('disconnect', (reason: any, details: any) => {
            console.log(
                'disconnect',
                JSON.stringify({
                    reason,
                    details,
                })
            );
            setIsConnected(false);
            setError(null);
        });
        socketInstance.on('data', async (data, callback) => {
            console.log(`Got data from socket-io server:\n\n ${data}`, {
                data,
                callback,
            });
            const result = await ipcRenderer.invoke?.('sg-event', data);
            console.log(
                'Received a response from the event-handler (socket): ',
                {
                    result,
                    callback,
                }
            );
            if (callback) {
                callback(null, result);
            }
        });
        socketInstance.on(EventTypes.PairingOffer, (data) => {
            console.log(
                'Received pairing offer',
                JSON.stringify(data, null, 2)
            );
            setParingData(data);
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Connection Error:', error);
            setIsConnected(false);
            setIsLoading(false);
            setError(error);
        });

        socketInstance.on('connect_timeout', (timeout) => {
            console.error('Connection Timeout:', timeout);
            setIsConnected(false);
            setIsLoading(false);
            setError(timeout);
        });

        socketRef.current = socketInstance;
        return () => {
            if (socketInstance) {
                console.log('Cleaning up socket connection', socketInstance);
                socketInstance.disconnect(); // 💡 Properly disconnect the socket here
            }
            setIsLoading(false);
        };
    }, []);

    const onCopyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            notifications.show({
                title: 'Pairing Link',
                message: 'Copied URL to Clipboard',
            });
        } catch (e) {
            console.error('Failed to copy:', e);
        }
    };
    return (
        <Center>
            <Flex direction={'column'}>
                <Center>
                    <Text>
                        Connection to {VITE_SERVER_URL}:{'\u00A0'}
                    </Text>
                    <Center>
                        <IconCircleFilled
                            size={15}
                            color={isConnected ? 'green' : 'red'}
                        />
                    </Center>
                    {error && !isLoading && !isConnected && (
                        <Text style={{ color: 'red' }}>{error.toString()}</Text>
                    )}
                    {!error && !isLoading && isConnected && (
                        <Text style={{ color: 'green' }}>OK</Text>
                    )}
                </Center>
                <Stack>
                    {paringData && (
                        <Stack>
                            <Group m="2">
                                <Text>
                                    <span>Open </span>
                                    <Anchor
                                        href={`${paringData.pairingCode}`}
                                        target="_blank"
                                    >
                                        {`${VITE_FRONTEND_ORIGIN}/?pairingCode=${paringData?.pairingCode}`}
                                    </Anchor>
                                    <span> to pair.</span>
                                </Text>
                            </Group>
                            <Box p="2">
                                <Button
                                    style={{ width: '100%' }}
                                    onClick={async () => {
                                        await onCopyToClipboard(url);
                                    }}
                                >
                                    Copy URL to Clipboard
                                </Button>
                            </Box>
                            <Box p="2">
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <QRCodeSVG
                                        title="StreamGlass Pairing QR Code"
                                        value={url}
                                        size={256}
                                        marginSize={4}
                                        level="H"
                                        bgColor="white"
                                        fgColor="black"
                                    ></QRCodeSVG>
                                </div>
                            </Box>
                        </Stack>
                    )}
                </Stack>
            </Flex>
        </Center>
    );
}

/* 
        <Flex gap="4" align={'center'} justify={'center'}>
            <Spinner loading={isLoading}>
                <Flex align={'center'} justify={'center'} direction={'column'}>
                    <Flex align={'center'} justify={'center'} direction={'row'}>
                        <Text align={'center'} size={'2'}>
                            Connection to {VITE_SERVER_URL}:
                        </Text>
                        <DotFilledIcon
                            color={isConnected ? green.green10 : red.red10}
                            width={'30'}
                            height={'30'}
                        ></DotFilledIcon>
                        {error && !isLoading && !isConnected && (
                            <Text
                                align={'center'}
                            
                                style={{ color: red.red5 }}
                            >
                                {error.toString()}
                            </Text>
                        )}
                        {!error && !isLoading && isConnected && (
                            <Text
                                align={'center'}
                            
                                style={{ color: green.green5 }}
                            >
                                OK
                            </Text>
                        )}
                    </Flex>
                    <Box>
                        {paringData && (
                            <Container>
                                <Box p="2">
                                    <span>
                                        <span>Open </span>
                                        <Anchor  
                                            href={`${paringData.pairingCode}`}
                                        >
                                            {`${VITE_FRONTEND_ORIGIN}/?pairingCode=${paringData?.pairingCode}`}
                                        </Anchor  >
                                        <span> to pair.</span>
                                    </span>
                                </Box>
                                <Box p="2">
                                    <Button
                                        style={{ width: '100%' }}
                                        onClick={async () => {
                                            await onCopyToClipboard(url);
                                        }}
                                    >
                                        Copy URL to Clipboard
                                    </Button>
                                    <Toast.Root
                                        className="ToastRoot"
                                        open={isToastOpen}
                                        onOpenChange={isToastOpen}
                                    >
                                        <Toast.Title className="ToastTitle">
                                            Copied to Clipboard
                                        </Toast.Title>
                                        <Toast.Description asChild>
                                            <div
                                                className="ToastDescription"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <CheckCircledIcon />
                                            </div>
                                        </Toast.Description>
                                    </Toast.Root>
                                </Box>
                                <Box p="2">
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <QRCodeSVG
                                            title="StreamGlass Pairing QR Code"
                                            value={url}
                                            size={256}
                                            marginSize={4}
                                            level="H"
                                            bgColor="white"
                                            fgColor="black"
                                        ></QRCodeSVG>
                                    </div>
                                </Box>
                            </Container>
                        )}
                    </Box>
                </Flex>
            </Spinner>
        </Flex>

*/
