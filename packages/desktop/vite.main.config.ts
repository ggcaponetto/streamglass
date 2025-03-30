import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
});
