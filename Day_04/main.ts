function readWordSearchData(fileName: string): string[] {
    // Read textfile containing the word search data
    const data = Deno.readTextFileSync(fileName);
    // Process the data line by line. Put the lines in an array
    // and return the array.
    const lines: string[] = [];
    for (const line of data.split("\n")) {
        lines.push(line);
    }
    return lines;
}

function horizontalSearch(data: string[], word: string): number {
    // Use a regular expression to find all occurences of the word.
    // (case insensitive). We also search for the reversed word.
    const regex = new RegExp(word, "gi");
    const regexReversed = new RegExp(word.split("").reverse().join(""), "gi");
    let wordCount = 0;
    for (const line of data) {
        wordCount += Array.from(line.matchAll(regex)).length;
        wordCount += Array.from(line.matchAll(regexReversed)).length;
    }
    return wordCount;
}

function verticalSearch(data: string[], word: string): number {
    // Convert the data by transposing the columns to rows so
    // that we can use the horizontal search function.
    const dataT: string[] = [];
    for (let i = 0; i < data[0].length; i++) {
        let row = "";
        for (let j = 0; j < data.length; j++) {
            row += data[j][i];
        }
        dataT.push(row);
    }
    return horizontalSearch(dataT, word);
}

function diagonalSearch(data: string[], word: string): number {
    // Shift everything one position to the right. In this way we
    // can perform a vertical search on the shifted data.
    let dataShifted: string[] = [];
    let wordCount = 0;
    for (const [index, line] of data.entries()) {
        dataShifted.push(`${".".repeat(index)}${line}${".".repeat(data[0].length - 1 - index)}`);
    }
    wordCount += verticalSearch(dataShifted, word);
    // Shift everything one position to the left. Again, we can
    // perform a vertical search on the shifted data.
    dataShifted = [];
    for (const [index, line] of data.entries()) {
        dataShifted.push(`${".".repeat(data[0].length - 1 - index)}${line}${".".repeat(index)}`);
    }
    wordCount += verticalSearch(dataShifted, word);
    return wordCount;
}

function xmasCountmasSearch(data: string[]): number {
    // See the file X-MAS.txt for details about the pattern matching
    // routine we use below. Basically we make use of the fact that
    // an A is always in the middle and the characters on the corners
    // can only occur in four specific patterns.
    let xmasCount = 0;
    const patterns = ["MMSS", "MSMS", "SSMM", "SMSM"];
    // Proces array
    for (let row = 1; row < data.length - 1; row++) {
        for (let column = 1; column < data[0].length - 1; column++) {
            if (data[row][column] === "A") {
                // Check corner pattern
                const topLeft = data[row - 1][column - 1];
                const topRight = data[row - 1][column + 1];
                const bottomLeft = data[row + 1][column - 1];
                const bottomRight = data[row + 1][column + 1];
                const pattern = topLeft + topRight + bottomLeft + bottomRight;
                if (patterns.includes(pattern)) xmasCount += 1;
            }
        }
    }
    return xmasCount;
}

function search(data: string[], word: string): number {
    // Perform all possible searches
    return horizontalSearch(data, word) + verticalSearch(data, word) + diagonalSearch(data, word);
}

if (import.meta.main) {
    // Read word search data
    const data = readWordSearchData("./word_search.txt");
    console.log(`XMAS was found ${search(data, "XMAS")} times.`);
    console.log(`Two MAS in the shape of an X was found ${xmasCountmasSearch(data)} times.`);
}
