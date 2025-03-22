import { createContext, ReactNode, useState } from 'react';

// Define the shape of your context value
export interface CounterContextType {
    counter: number | null;
    setCounter: React.Dispatch<React.SetStateAction<number | null>>;
}

export const CounterContext = createContext<null | CounterContextType>(null);

export const CounterContextProvider = ({ children }: { children: ReactNode }) => {
    const [counter, setCounter] = useState<number | null>(null);
    return (
        <CounterContext.Provider value={{counter, setCounter}}>
            {children}
        </CounterContext.Provider>
    )
}
