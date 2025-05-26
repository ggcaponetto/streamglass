function testFunction1() {
    console.log('Hello world! 1');
}

function testFunction2() {
    console.log('Hello world! 2');
}

function testFunction3() {
    console.log('Hello world! 3');
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getMapping() {
    return {
        1: {
            type: 'nodejs',
            description: 'Do this and that 1',
            script: testFunction1,
        },
        2: {
            type: 'nodejs',
            description: 'Do this and that 2',
            script: testFunction2,
        },
        3: {
            type: 'nodejs',
            description: 'Do this and that 3',
            script: testFunction3,
        },
    };
}
