export type ClientId = string;
export type ConnectionId = string;
export type AppType = string;
export type ClientType = {clientId: ClientId, type: ClientType}

export type Pairing = {
    clients: {clientId: ClientId, type: AppType}[];
};

// Whatever shape your state has
export type State = { [pairingCode: string]: Pairing };

export type PairingOffer = {
    pairingCode: string;
    state: State;
};

export type PairingRequest = {
    pairingCode: string;
};
