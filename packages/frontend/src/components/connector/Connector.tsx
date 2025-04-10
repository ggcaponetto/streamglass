import { useEffect, useRef, useState } from 'react';
import { ClientTypes, SocketData, PairingRequest } from 'sg-utilities';
import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL;
export default function Connector() {
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status
    const [pairingCode, setPairingCode] = useState<string | null>(null); // Track pairing code

    const sendCommand = () => {
        if (socketRef.current) {
            const data = {
                pairingCode,
                targetClientTypes: [ClientTypes.Server],
                data: new Date().toISOString(),
            } as SocketData;
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
    };

    useEffect(() => {
        // 🔍 Extract the "code" query parameter from the URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('pairingCode');
        setPairingCode(code);
    }, []);

    useEffect(() => {
        if (pairingCode && isConnected) {
            const pairingRequest = {
                pairingCode,
                type: ClientTypes.Frontend,
                socketId: socketRef.current?.id,
            } as PairingRequest;
            console.log('Emitting pairing request:', pairingRequest);
            socketRef.current?.emit('pairing-request', pairingRequest);
        }
    }, [pairingCode, isConnected]);

    useEffect(() => {
        console.log(`Connecting to ${URL}`);
        const socketInstance = io(URL);
        socketInstance.on('connect', () => {
            console.log('connect');
            setIsConnected(true); // Update state
        });
        socketInstance.on('disconnect', (reason, details) => {
            console.log(
                'disconnect',
                JSON.stringify({
                    reason,
                    details,
                })
            );
            setIsConnected(false); // Update state
        });
        socketInstance.on('data', (data) => {
            console.log('data', data);
        });
        socketRef.current = socketInstance;
        return () => {
            if (socketInstance) {
                console.log('Cleaning up socket connection', socketInstance);
                socketInstance.disconnect(); // 💡 Properly disconnect the socket here
            }
        };
    }, []);
    return (
        <div>
            <div>
                Is connected to {URL}: {isConnected ? 'yes' : 'no'}
            </div>
            <div>Pairing code: {pairingCode}</div>
            <button onClick={sendCommand}>send command</button>
        </div>
    );
}
