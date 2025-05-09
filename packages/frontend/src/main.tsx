import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/app/App.tsx';
import './i18n';
import './index.css';
import './components/mapping/userWorker.ts';

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
