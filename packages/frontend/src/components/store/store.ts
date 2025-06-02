import { create } from 'zustand';

import defaultMapText from '../mapping/maps/default?raw';

export type State = {
    isConnected: boolean;
    setIsConnected: (isConnected: boolean) => void;
    setSendCommand: (sendCommand: () => void) => void;
    sendCommand: (...args: unknown[]) => void;
    mapping?: string;
    setMapping?: (mapping: string) => void;
};

const useStore = create<State>((set) => ({
    isConnected: false,
    setIsConnected: (isConnected: boolean) => set(() => ({ isConnected })),
    setSendCommand: (sendCommand: (...args: unknown[]) => void) =>
        set(() => ({ sendCommand })),
    sendCommand: () => {
        console.log('Not implemented yet');
    },
    mapping: defaultMapText,
    setMapping: (mapping: string) => set(() => ({ mapping })),
}));

export { useStore };
