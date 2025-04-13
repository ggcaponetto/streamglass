import { defineConfig } from 'vite';


// https://vitejs.dev/config
export default defineConfig({
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.SERVER_SOCKET_IO_PORT': JSON.stringify(process.env.SERVER_SOCKET_IO_PORT),
        'process.env.VITE_FRONTEND_ORIGIN': JSON.stringify(process.env.VITE_FRONTEND_ORIGIN),
        'process.env.VITE_DESKTOP_ORIGIN': JSON.stringify(process.env.VITE_DESKTOP_ORIGIN),
        'process.env.VITE_SERVER_URL': JSON.stringify(process.env.VITE_SERVER_URL),
        'process.env.ENABLE_COVERAGE_TRESHOLD': JSON.stringify(process.env.ENABLE_COVERAGE_TRESHOLD),
    },
});
