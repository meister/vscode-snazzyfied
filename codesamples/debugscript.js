const runLoop = times => {
    console.log(`Running loop ${times} times`);
    for (var i = 0; i < times; i++) {
        console.log(`Cycle: ${i}`);

        if (i === 2) {
            throw new Error('Throws');
        }
    }
}

runLoop(3);