import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL;
export default function Connector() {
    const socketRef = useRef<null | Socket>(null);
    const [isConnected, setIsConnected] = useState(false); // Track connection status

    useEffect(() => {
        console.log(`Connecting to ${URL}`);
        const socketInstance = io(URL);
        socketInstance.on("connect", () => {
            console.log("connect");
            setIsConnected(true); // Update state
        });
        socketInstance.on("disconnect", (reason, details) => {
            console.log("disconnect", JSON.stringify({
                reason, details
            }))
            setIsConnected(false); // Update state
        });
        socketInstance.on("data", (data) => {
            console.log("data", data)
        });
        const handle = setInterval(() => {
            if (socketInstance) {
                socketInstance.emit('data', new Date());
            }
        }, 1000)
        socketRef.current = socketInstance;
        return () => {
            if(handle){
                clearInterval(handle);
            }
            if (socketInstance) {
                console.log("Cleaning up socket connection", socketInstance);
                socketInstance.disconnect(); // 💡 Properly disconnect the socket here
            }
        }
    }, [])
    return (
        <div>
            Is connected: {isConnected ? "yes" : "no"}
        </div>
    )
}