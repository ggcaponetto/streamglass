import { ReactNode, useState } from "react";
import { CounterContext } from "./counter-context";


export const CounterContextProvider = ({ children }: { children: ReactNode }) => {
    const [counter, setCounter] = useState<number | null>(null);
    return (
        <CounterContext.Provider value={{counter, setCounter}}>
            {children}
        </CounterContext.Provider>
    )
}
