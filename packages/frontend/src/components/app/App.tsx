import './App.css'
import Connector from '../connector/Connector';
import {version} from "../../../package.json";

function App() {
  return (
    <div>
      <Connector />
      <span>version {version}</span>
    </div>
  )
}

export default App;

