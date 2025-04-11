import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/app/App.tsx';

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
