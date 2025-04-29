import { useCallback, useEffect, useRef, useState } from 'react';
import { ClientTypes, SocketData, PairingRequest } from 'sg-utilities';
import { io, Socket } from 'socket.io-client';
import { State, useStore } from '../store/store';

const URL = import.meta.env.VITE_SERVER_URL;

export function useSocketConnector() {
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [pairingCode, setPairingCode] = useState<string | null>(null);

    const setIsConnectedStore = useStore(
        (state: State) => state.setIsConnected
    );
    const setSendCommandStore = useStore(
        (state: State) => state.setSendCommand
    );

    useEffect(() => {
        setIsConnectedStore(isConnected);
    }, [isConnected, setIsConnectedStore]);

    const sendCommand = useCallback((...args: unknown[]) => {
        if (socketRef.current && pairingCode !== null) {
            const data: SocketData = {
                pairingCode,
                targetClientTypes: [ClientTypes.Server],
                data: args,
            };
            socketRef.current.emit(
                'data',
                data,
                (err: unknown, data: unknown) => {
                    console.log('Command execution acknowledged', {
                        err,
                        data,
                    });
                }
            );
        }
    }, [pairingCode]);

    useEffect(() => {
        setSendCommandStore(sendCommand);
    }, [sendCommand, setSendCommandStore]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('pairingCode');
        setPairingCode(code);
    }, []);

    useEffect(() => {
        if (pairingCode && isConnected && socketRef.current?.id) {
            const pairingRequest: PairingRequest = {
                pairingCode,
                type: ClientTypes.Frontend,
                socketId: socketRef.current?.id,
            };
            console.log('Emitting pairing request:', pairingRequest);
            socketRef.current?.emit('pairing-request', pairingRequest);
        }
    }, [pairingCode, isConnected]);

    useEffect(() => {
        const socketInstance = io(URL);

        socketInstance.on('connect', () => {
            console.log('connect');
            setIsConnected(true);
        });
        socketInstance.on('disconnect', (reason, details) => {
            console.log('disconnect', JSON.stringify({ reason, details }));
            setIsConnected(false);
        });
        socketInstance.on('data', (data) => {
            console.log('data', data);
        });

        socketRef.current = socketInstance;

        return () => {
            if (socketInstance) {
                console.log('Cleaning up socket connection', socketInstance);
                socketInstance.disconnect();
            }
        };
    }, []);
}
