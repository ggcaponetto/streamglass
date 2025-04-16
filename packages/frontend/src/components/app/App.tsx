import './App.css';
import Connector from '../connector/Connector';
import { version } from '../../../package.json';
import { SGGrid } from '../grid/Grid';

function App() {
    return (
        <div
            style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            v{version}
            <Connector></Connector>
            <SGGrid />
        </div>
    );
}

export default App;
