export type ClientId = string;
export type ConnectionId = string;
export type ClientType = {clientId: ClientId, type: ClientTypes}

export enum ClientTypes {
    Desktop = 'Desktop',
    Frontend = 'Frontend',
    Server = "Server"
}

export type Client = {
    clientId: ClientId, type: ClientTypes
}

export type Pairing = {
    clients: Client[];
};

export type State = { [pairingCode: string]: Pairing };

export type PairingOffer = {
    pairingCode: string;
    state: State;
};

export type PairingRequest = {
    pairingCode: string;
    type: ClientTypes;
    clientId: ClientId;
};
