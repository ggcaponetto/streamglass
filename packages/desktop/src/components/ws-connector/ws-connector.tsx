import { Flex, Spinner, Text } from '@radix-ui/themes';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DotFilledIcon } from '@radix-ui/react-icons';
import { green, red } from '@radix-ui/colors';

const URL = import.meta.env.VITE_SERVER_URL;

export default function Connector() {
    const [isLoading, setIsLoading] = useState(false);
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status
    useEffect(() => {
        console.log(`Connecting to ${URL}`);
        setIsLoading(true);
        const socketInstance = io(URL);
        socketInstance.on('connect', () => {
            console.log('connect');
            setIsConnected(true); // Update state
            setIsLoading(false);
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
        });
        socketInstance.on('data', (data) => {
            console.log('data', data);
        });
        const handle = setInterval(() => {
            if (socketInstance) {
                socketInstance.emit('data', new Date());
            }
        }, 1000);
        socketRef.current = socketInstance;
        return () => {
            if (handle) {
                clearInterval(handle);
            }
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
                <Flex align={'center'} justify={'center'}>
                    <Text align={'center'} size={'2'}>
                        Connection:
                    </Text>
                    <DotFilledIcon
                        color={isConnected ? green.green10 : red.red10}
                        width={'30'}
                        height={'30'}
                    ></DotFilledIcon>
                </Flex>
            </Spinner>
        </Flex>
    );
}
