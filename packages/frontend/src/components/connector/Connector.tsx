import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL;
export default function Connector() {
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status
    const [pairingCode, setPairingCode] = useState<string | null>(null); // Track pairing code

    const sendCommand = () => {
        if (socketRef.current) {
            socketRef.current.emit('data', new Date());
        }
    };

    useEffect(() => {
        // 🔍 Extract the "code" query parameter from the URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('pairingCode');
        setPairingCode(code);
    }, []);

    useEffect(() => {
        // TODO fix this use effect
        if (pairingCode && socketRef.current) {
            const data = {
                pairingCode: 1333,
                socketId: socketRef.current.id,
            };
            console.log('Emitting pairing code:', pairingCode);
            socketRef.current?.emit('pairing-data', data);
        }
    }, [pairingCode]);

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
            <div>Is connected: {isConnected ? 'yes' : 'no'}</div>
            <div>Pairing code: {pairingCode}</div>
            <button onClick={sendCommand}>send command</button>
        </div>
    );
}
