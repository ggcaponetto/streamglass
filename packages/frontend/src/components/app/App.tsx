import './App.css';
import Connector from '../connector/Connector';
import { version } from '../../../package.json';
import { Text, Box, Container, Flex } from '@radix-ui/themes';
import { SGGrid } from '../grid/Grid';

function App() {
    return (
        <Container
            style={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Flex
                flexGrow={'1'}
                align={'center'}
                justify={'center'}
                direction={'column'}
            >
                <Connector />
                <Box>
                    <Text align={'center'} size={'5'}>
                        v{version}
                    </Text>
                </Box>
            </Flex>
            <SGGrid />
        </Container>
    );
}

export default App;
