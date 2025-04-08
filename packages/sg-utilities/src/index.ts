
export type ClientId = string;
export type ConnectionId = string;

export type Pairing = {
    clients: string[];
};

// Whatever shape your state has
export type State = { [pairingCode: string]: Pairing };

export type PairingOffer = {
    pairingCode: string;
    pairingData: {
        clients: string[];
    };
};

export type PairingRequest = {
    pairingCode: string;
};
