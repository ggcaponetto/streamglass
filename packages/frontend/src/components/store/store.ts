import { create } from 'zustand';

export type State = {
    isConnected: boolean;
    setIsConnected: (isConnected: boolean) => void;
    setSendCommand: (sendCommand: () => void) => void;
    sendCommand: (...args: unknown[]) => void;
};

const useStore = create<State>((set) => ({
    isConnected: false,
    setIsConnected: (isConnected: boolean) => set(() => ({ isConnected })),
    setSendCommand: (sendCommand: (...args: unknown[]) => void) =>
        set(() => ({ sendCommand })),
    sendCommand: () => {
        console.log('Not implemented yet');
    },
}));

export { useStore };
