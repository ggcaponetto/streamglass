import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM doesn't have __dirname, so we recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.VITE_DESKTOP_ORIGIN !== undefined ?
     parseInt(process.env.VITE_DESKTOP_ORIGIN.split(':')[2], 10) : 5174;

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            'sg-utilities/constants/event-types': path.resolve(
                __dirname,
                '../../packages/sg-utilities/src/constants/event-types.ts'
            ),
        },
    },
    define: {
        'import.meta.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV
        ),
        'import.meta.env.VITE_SERVER_URL': JSON.stringify(
            process.env.VITE_SERVER_URL
        ),
        'import.meta.env.VITE_DESKTOP_ORIGIN': JSON.stringify(
            process.env.VITE_DESKTOP_ORIGIN
        ),
        'import.meta.env.VITE_FRONTEND_ORIGIN': JSON.stringify(
            process.env.VITE_FRONTEND_ORIGIN
        )
    },
    server: {
        port,
    }
});
