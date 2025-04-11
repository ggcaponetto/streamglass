import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/app/App.tsx';

import { checkRequiredEnvVars } from 'sg-utilities/check-envs';

checkRequiredEnvVars([
    'SERVER_SOCKET_IO_PORT',
    'VITE_FRONTEND_ORIGIN',
    'VITE_DESKTOP_ORIGIN',
    'VITE_SERVER_URL',
    'ENABLE_COVERAGE_TRESHOLD',
]);

const container = document.getElementById('root');
if (container) {
    createRoot(container).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
} else {
    console.error(
        "Couldn't fint a an HTMLElement with id 'root' to inject the react app."
    );
}
