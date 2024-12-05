function readRules(fileName: string): string[] {
    // Read file with page ordering rules
    const data = Deno.readTextFileSync(fileName);
    const rules: string[] = [];
    for (const line of data.split("\n")) {
        rules.push(line);
    }
    return rules;
}

function readUpdates(fileName: string): string[][] {
    // Read file with updated page numbers
    const data = Deno.readTextFileSync(fileName);
    const update: string[][] = [];
    for (const line of data.split("\n")) {
        update.push(line.split(","));
    }
    return update;
}

function checkUpdate(update: string[], rules: string[]): boolean {
    // Check if an update contains pages in the correct order.
    for (let i = 0; i <= update.length - 2; i++) {
        for (let j = i + 1; j <= update.length - 1; j++) {
            if (rules.includes(`${update[j]}|${update[i]}`)) {
                // At least one pair of pages is in the wrong order
                return false;
            }
        }
    }
    return true;
}

function correctUpdate(update: string[], rules: string[]): string[] {
    // This function fixes incorrect updates by sorting the page
    // numbers in the correct order. Sorting takes place by looping
    // over the array and sorting the elements pairwise. We keep on
    // looping until the update checks out.
    const correctedUpdate: string[] = [...update];
    while (!checkUpdate(correctedUpdate, rules)) {
        for (let i = 0; i <= correctedUpdate.length - 2; i += 1) {
            if (rules.includes(`${correctedUpdate[i + 1]}|${correctedUpdate[i]}`)) {
                // Wrong order => change page positions
                [correctedUpdate[i], correctedUpdate[i + 1]] = [correctedUpdate[i + 1], correctedUpdate[i]];
            }
        }
    }
    return correctedUpdate;
}

function checkUpdates(updates: string[][], rules: string[]): [number, number] {
    // Check all updates and fix the ones that are incrorrect. Determine
    // the sum of the middle page numbers of all correct updates and the
    // sum of the middle page numbers of all fixed updates.
    let sum = 0;
    let correctedSum = 0;
    for (const update of updates) {
        if (checkUpdate(update, rules)) {
            // Update is correct
            sum += parseInt(update[(update.length - 1) / 2]);
        } else {
            // Update is incorrect and needs to be fixed (part 2 of the challenge)
            const correctedUpdate = correctUpdate(update, rules);
            correctedSum += parseInt(correctedUpdate[(correctedUpdate.length - 1) / 2]);
        }
    }
    return [sum, correctedSum];
}

if (import.meta.main) {
    // Read in the rules
    const rules = readRules("./page_ordering_rules.txt");
    // Read in the updates with page numbers
    const updates = readUpdates("./page_updates.txt");
    // Determine the sums of the page numbers in the middle
    const [sum, correctedSum] = checkUpdates(updates, rules);
    console.log(`Sum of middle pages of correct updates: ${sum}.`);
    console.log(`Sum of middle pages of fixed updates  : ${correctedSum}.`);
}
