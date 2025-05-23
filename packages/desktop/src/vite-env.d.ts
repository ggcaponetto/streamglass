interface ImportMetaEnv {
    VITE_FRONTEND_ORIGIN: any;
    VITE_DESKTOP_ORIGIN: any;
    readonly VITE_SERVER_URL: string; // replace with your actual env vars
    // add more VITE_ variables as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
