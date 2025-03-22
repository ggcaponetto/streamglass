import { useContext } from 'react';
import { CounterContext, CounterContextProvider } from '../../context/counter/counter-context'
import './App.css'

function ComponentA(){
  const {counter, setCounter} = useContext(CounterContext)!;
  console.log("rendered ComponentA");
  return (
    <div>
      ComponentA -  Counter : {counter || "Not set"}
      <button onClick={()=>{
        setCounter((counter || 0) + 1)
      }}>increment</button>
    </div>
  )
}

function ComponentB(){
  console.log("rendered ComponentB");
  return (
    <div>
      ComponentB
    </div>
  )
}

function App() {
  return (
    <>
      <div>
        <div>Test</div>
        <CounterContextProvider>
          <ComponentA />
          <div>
            <ComponentB />
          </div>
        </CounterContextProvider>
      </div>
    </>
  )
}

export default App;

