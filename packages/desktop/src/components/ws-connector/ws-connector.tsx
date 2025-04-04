import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { cyan, green, red } from '@radix-ui/colors';

const URL = import.meta.env.VITE_SERVER_URL;

export default function Connector() {
    const [isLoading, setIsLoading] = useState(false);
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status
    const [error, setError] = useState(null);
    const [paringData, setParingData] = useState(null);

    useEffect(() => {
        if (isConnected === false) {
            setParingData(null);
        }
    }, [isConnected]);

    useEffect(() => {
        console.log(`Connecting to ${URL}`);
        setIsLoading(true);
        const socketInstance = io(URL);
        socketInstance.on('connect', () => {
            console.log('connect');
            setIsConnected(true); // Update state
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
            setIsConnected(false); // Update state
            setIsLoading(false);
            setError(null);
        });
        socketInstance.on('data', (data) => {
            console.log('data', data);
        });
        socketInstance.on('pairing-data', (data) => {
            console.log('Received pairing-data', JSON.stringify(data, null, 2));
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
    return (
        <Flex gap="4" align={'center'} justify={'center'}>
            <Spinner loading={isLoading}>
                <Flex align={'center'} justify={'center'} direction={'column'}>
                    <Flex align={'center'} justify={'center'} direction={'row'}>
                        <Text align={'center'} size={'2'}>
                            Connection:
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
                            <Text
                                align={'center'}
                                size={'1'}
                                style={{ color: cyan.cyan8 }}
                            >
                                {paringData.pairingCode}
                            </Text>
                        )}
                    </Box>
                </Flex>
            </Spinner>
        </Flex>
    );
}
