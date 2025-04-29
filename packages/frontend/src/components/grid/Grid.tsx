import { Button, SimpleGrid, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { State, useStore } from '../store/store';

export function SGGrid() {
    const [grid] = useState({ columns: 5, rows: 3 });
    const sendCommandStore = useStore((state: State) => state.sendCommand);

    const getCells = () => {
        const totalCells = grid.columns * grid.rows;
        return Array.from({ length: totalCells }, (_, index) => (
            <div
                key={index}
                style={{
                    textAlign: 'center',
                    background: 'var(--mantine-color-primary-9)',
                    margin: 0,
                    padding: 0,
                }}
            >
                <Stack>
                    <Text>Cell {index + 1}</Text>
                    <Button
                        onClick={() => {
                            // const commandString = 'console.log(`This is cool`)';
                            const commandString = `
                            console.log('\x07');
                            const a = 2-5;
                            console.log('a: ' + a);
                            `;
                            sendCommandStore(commandString);
                        }}
                    >
                        send command
                    </Button>
                </Stack>
            </div>
        ));
    };

    return (
        <SimpleGrid
            cols={grid.columns}
            spacing="xs"
            verticalSpacing="xs"
            style={{ height: '100%', margin: 0, padding: 0 }}
        >
            {getCells()}
        </SimpleGrid>
    );
}
