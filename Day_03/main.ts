function readCorruptedMemory(fileName: string): string {
    // Read textfile containing the corrupted memory
    const data = Deno.readTextFileSync(fileName);
    // Process the data line by line. Put the lines in an array.
    const lines: string[] = [];
    for (const line of data.split("\n")) {
        lines.push(line);
    }
    // Combine the lines into a single string which
    // can easily be parsed.
    return lines.join("");
}

function findMultiplications(corrupted_memory: string): string[] {
    // Use a regular expression to find all occurences
    // of multiplication of the form mul(... , ...).
    // Also check for do() and don't(): this was part two
    // of the challenge.

    // const regex = /mul\(\d+,\d+\)/g;
    const regex = /\b(do\(\)|don't\(\)|mul\(\d+,\d+\))/g;
    const matches = corrupted_memory.match(regex);
    if (matches) return matches as string[];
    return [];
}

function performMultiplication(multiplication: string): number {
    // Given a multiplication like "mul(... , ...)" we can
    // use a regular expression with capturing groups to get
    // the two numbers and perform the multiplication.
    const regex = /mul\((\d+),(\d+)\)/;
    const match = multiplication.match(regex);
    if (match) {
        const num1 = parseInt(match[1]);
        const num2 = parseInt(match[2]);
        return num1 * num2;
    }
    return 0;
}

if (import.meta.main) {
    // Read corrupted memory as a string
    const corruptedMemory = readCorruptedMemory("./corrupted_memory.txt");
    // Find all multiplications
    const multiplications = findMultiplications(corruptedMemory);
    // Determine the sum of all multiplications without taking do()
    // and don't() into account.
    let sum = 0;
    for (const multiplication of multiplications) {
        sum += performMultiplication(multiplication);
    }
    console.log(`The sum of all multiplications WITHOUT do() and don't() is: ${sum}`);
    // Determine the sum of all multiplications while taking do()
    // and don't() into account.
    sum = 0;
    let multiply = true;
    for (const multiplication of multiplications) {
        if (multiplication === "do()") multiply = true;
        if (multiplication === "don't()") multiply = false;
        if (multiply) sum += performMultiplication(multiplication);
    }
    console.log(`The sum of all multiplications WITH do() and don't() is: ${sum}`);
}
