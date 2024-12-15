function readStones(fileName: string): string[] {
    // Read file with stones as a string array
    return Deno.readTextFileSync(fileName).split(" ");
}

function processBlink(stone: string): string[] {
    // Process a single blink for a single stone by applying the rules
    if (stone.length === 1) {
        // Number 0 => number 1
        if (stone === "0") return ["1"];
    }
    if (stone.length % 2 === 0) {
        // Even number of digits => split, without leading zeros
        const number1 = parseInt(stone.slice(0, stone.length / 2));
        const number2 = parseInt(stone.slice(stone.length / 2));
        return [number1.toString(), number2.toString()];
    }
    const newNumber = parseInt(stone) * 2024;
    return [newNumber.toString()];
}

function processBlinks(initialStones: string[], numBlinks: number): string[] {
    // Part 1 of the challenge: process the specified number of blinks.
    // This routine breaks (memory) if the number of blinks is large.
    let blink = 1;
    let stones = [...initialStones];
    while (blink <= numBlinks) {
        const tempStones: string[] = [];
        for (const stone of stones) {
            const blinkResult = processBlink(stone);
            tempStones.push(...blinkResult);
        }
        stones = [...tempStones];
        blink += 1;
    }
    return stones;
}

function processBlinks2(initialStones: string[], numBlinks: number): Map<string, number> {
    // Part 2 of the challenge: process the specified number of blinks.
    // Basically the same functionality as in part 1, but now a different
    // approach to avoid running out of memory. We use a Map keep track of
    // the number of stones for each blink.
    let blink = 1;
    let stones: Map<string, number> = new Map();
    for (const stone of initialStones) {
        stones.set(stone, 1);
    }
    while (blink <= numBlinks) {
        const tempStones: Map<string, number> = new Map();
        for (const [stone, numStone] of stones) {
            // Note that the number of stones we already have (numStone)
            // is basically the offset of the current blink.
            const blinkResult = processBlink(stone);
            for (const newStone of blinkResult) {
                if (tempStones.has(newStone)) {
                    tempStones.set(newStone, tempStones.get(newStone)! + numStone);
                } else {
                    tempStones.set(newStone, numStone);
                }
            }
        }
        stones = tempStones;
        blink += 1;
    }
    return stones;
}

if (import.meta.main) {
    // Read in the stones configuration
    const initialStones = readStones("./stones.txt");
    // Part 1: process 25 blinks
    const stones1 = processBlinks(initialStones, 25);
    console.log(`Number of stones after 25 blinks: ${stones1.length}`);
    // Part 2: process 75 blinks
    const stones2 = processBlinks2(initialStones, 75);
    const sum = Array.from(stones2.values()).reduce((acc, curr) => (acc += curr), 0);
    console.log(`Number of stones after 75 blinks: ${sum}`);
}
