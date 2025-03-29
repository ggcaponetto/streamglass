import { createRoot } from 'react-dom/client';
import "./main.css";

const root = createRoot(document.getElementById("root"));
root.render(
    <div className='main-container'>
        <h2 style={{textAlign: 'center'}}>Welcome to StreamGlass</h2>
    </div>
);