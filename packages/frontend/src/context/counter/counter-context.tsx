import { createContext } from 'react'

// Define the shape of your context value
export interface CounterContextType {
    counter: number | null
    setCounter: React.Dispatch<React.SetStateAction<number | null>>
}

export const CounterContext = createContext<null | CounterContextType>(null)
