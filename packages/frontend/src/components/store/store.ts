import { create } from 'zustand';

import defaultMapText from '../mapping/maps/default?raw';
import { subscribeWithSelector } from 'zustand/middleware';

export type State = {
    isConnected: boolean;
    setIsConnected: (isConnected: boolean) => void;
    paringCode?: string;
    setPairingCode?: (paringCode: string) => void;
    mapping?: string;
    setMapping?: (mapping: string) => void;
};

const useStore = create(
    subscribeWithSelector<State>((set) => ({
        isConnected: false,
        setIsConnected: (isConnected: boolean) => set(() => ({ isConnected })),
        paringCode: undefined,
        setPairingCode: (paringCode: string) => set(() => ({ paringCode })),
        mapping: defaultMapText,
        setMapping: (mapping: string) => set(() => ({ mapping })),
    }))
);

const subscribe = <K extends keyof State>(
    key: K,
    callback: (value: State[K]) => void
) => {
    const unsubscribe = useStore.subscribe(
        (state) => state[key],
        (value) => {
            callback(value);
        },
        {
            fireImmediately: true,
        }
    );
    return unsubscribe;
};

export { useStore, subscribe };
