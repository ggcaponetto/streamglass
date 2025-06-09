import { DefaultEventsMap } from '@socket.io/component-emitter';
import { RefObject } from 'react';
import { Socket } from 'socket.io-client';
import { ClientTypes } from 'sg-utilities';

const sendToServer = (
    socketRef: RefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>,
    pairingCode: string | null,
    data: unknown
) => {
    socketRef?.current?.emit(
        'data',
        {
            data,
            pairingCode,
            targetClientTypes: [ClientTypes.Desktop, ClientTypes.Server],
        },
        (err: unknown, data: unknown) => {
            console.log('Command execution acknowledged', {
                err,
                data,
            });
        }
    );
};

export { sendToServer };
