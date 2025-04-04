import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    define: {
        'import.meta.env.VITE_SERVER_URL': JSON.stringify(process.env.VITE_SERVER_URL),
        'import.meta.env.VITE_DESKTOP_ORIGIN': JSON.stringify(process.env.VITE_DESKTOP_ORIGIN),
        'import.meta.env.VITE_FRONTEND_ORIGIN': JSON.stringify(process.env.VITE_FRONTEND_ORIGIN),
      },
});
