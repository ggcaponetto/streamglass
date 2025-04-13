import {
    Box,
    Button,
    Container,
    Flex,
    Link,
    Spinner,
    Text,
} from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DotFilledIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { green, red } from '@radix-ui/colors';
import { EventTypes } from 'sg-utilities/constants/event-types';
import { Toast } from 'radix-ui';
import { QRCodeSVG } from 'qrcode.react';

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
const VITE_FRONTEND_ORIGIN = import.meta.env.VITE_FRONTEND_ORIGIN;

const ipcRenderer = window.electron.ipcRenderer;

export default function Connector() {
    const [isLoading, setIsLoading] = useState(false);
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [paringData, setParingData] = useState(null);
    const [isToastOpen, setIsToastOpen] = useState(null);
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
            console.log(
                `Got data from socket-io server: ${JSON.stringify(data)}`
            );
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
            setIsToastOpen(true);
            setTimeout(() => {
                setIsToastOpen(false);
            }, 2000);
        } catch (e) {
            console.error('Failed to copy:', e);
        }
    };
    return (
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
                                size={'1'}
                                style={{ color: red.red5 }}
                            >
                                {error.toString()}
                            </Text>
                        )}
                        {!error && !isLoading && isConnected && (
                            <Text
                                align={'center'}
                                size={'1'}
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
                                        <Link
                                            href={`${paringData.pairingCode}`}
                                        >
                                            {`${VITE_FRONTEND_ORIGIN}/?pairingCode=${paringData?.pairingCode}`}
                                        </Link>
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
    );
}
