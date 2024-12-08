function readEquations(fileName: string): string[][] {
    // Read file with equations
    const data = Deno.readTextFileSync(fileName);
    const equations: string[][] = [];
    for (const line of data.split("\n")) {
        equations.push(line.split(":").map((el) => el.trim()));
    }
    return equations;
}

function checkEquation(answer: string, values: string, concatenation: boolean = false): boolean {
    // Check if the equation is correct
    // Convert answer and values to integers
    const testValue = parseInt(answer);
    const numbers = values.split(" ").map((el) => parseInt(el));
    // Determine how many operators there are an determine all possible
    // combinations of operators for this scenario
    const numOperators = numbers.length - 1;
    const operations = getOperations(numOperators, concatenation);
    // Loop through all possible combinations of operators
    for (const operation of operations) {
        let result = numbers[0];
        for (let i = 1; i < numbers.length; i++) {
            if (operation[i - 1] === "*") {
                // Multiplication
                result *= numbers[i];
            } else if (operation[i - 1] === "+") {
                // Addition
                result += numbers[i];
            } else {
                // Concatenation (part 2 of the challenge)
                result = parseInt(result.toString() + numbers[i].toString());
            }
        }
        if (result === testValue) return true;
    }
    return false;
}

function getOperations(numOperators: number, concatenation: boolean = false): string[] {
    // Get all possible combinations of operators. Bit of a hack using
    // the random generator to do this. Surprisingly enough it's pretty fast.
    // Could make it nicer with some caching, but it's ok for now.
    let operators: string[] = [];
    if (concatenation) {
        operators = ["*", "+", "c"];
    } else {
        operators = ["*", "+"];
    }
    // Use a set to get all unique combinations
    const combinations: Set<string> = new Set();
    // Use loop to find all possible combinations
    while (combinations.size !== Math.pow(operators.length, numOperators)) {
        const combination: string[] = [];
        for (let i = 0; i < numOperators; i++) {
            combination.push(operators[Math.floor(Math.random() * operators.length)]);
        }
        combinations.add(combination.join(""));
    }
    return Array.from(combinations);
}

if (import.meta.main) {
    // Read in the equations
    const equations = readEquations("./equations.txt");
    // Challnge part 1
    let sum = 0;
    for (const equation of equations) {
        if (checkEquation(equation[0], equation[1], false)) {
            sum += parseInt(equation[0]);
        }
    }
    console.log(`Total calibration result part 1: ${sum}`);
    // Challenge part 2
    sum = 0;
    for (const equation of equations) {
        if (checkEquation(equation[0], equation[1], false)) {
            sum += parseInt(equation[0]);
        } else {
            // Check if concatenation solves the problem
            if (checkEquation(equation[0], equation[1], true)) {
                sum += parseInt(equation[0]);
            }
        }
    }
    console.log(`Total calibration result part 2: ${sum}`);
}
