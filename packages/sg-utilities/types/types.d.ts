export type ClientId = string;
export type ConnectionId = string;

type SocketId = Socket['id'];

export type Pairing = {
    clients: SocketId[];
};

// Whatever shape your state has
export type State = { [pairingCode: string]: Pairing };

export type PairingOffer = {
    pairingCode: string;
    pairingData: {
        clients: SocketId[];
    };
};

export type PairingRequest = {
    pairingCode: string;
};
