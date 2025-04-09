export type SocketId = string;
export type ConnectionId = string;
export type ClientType = { socketId: SocketId; type: ClientTypes };

export enum ClientTypes {
    Desktop = 'Desktop',
    Frontend = 'Frontend',
    Server = 'Server',
}

export type Client = {
    socketId: SocketId;
    type: ClientTypes;
};

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
    socketId: SocketId;
};

export type SocketData = {
    pairingCode: string;
    targetClientTypes: ClientTypes[];
    data: unknown;
};
