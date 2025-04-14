import { Box, Button, Grid } from '@radix-ui/themes';

export function SGGrid() {
    return (
        <Grid columns={{ initial: '1', md: '2' }} gap="3" width="auto">
            <Box>
                <Button>hello</Button>
            </Box>
            <Box>
                <Button>hello</Button>
            </Box>
            <Box>
                <Button>hello</Button>
            </Box>
            <Box>
                <Button>hello</Button>
            </Box>
            <Box>
                <Button>hello</Button>
            </Box>
            <Box>
                <Button>hello</Button>
            </Box>
        </Grid>
    );
}
