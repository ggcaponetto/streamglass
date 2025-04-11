import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM alternative to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.VITE_FRONTEND_ORIGIN !== undefined ?
     parseInt(process.env.VITE_FRONTEND_ORIGIN.split(':')[2], 10) : 5173;
     

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    envDir: path.resolve(__dirname, './../../'),
    base: './', // or your deployment subpath
    server: {
        port,
    },
});
