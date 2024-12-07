// Custom type for guard position
type Position = {
    row: number;
    col: number;
    direction: string;
};

function readMap(fileName: string): string[][] {
    // Read file with map data
    const data = Deno.readTextFileSync(fileName);
    const map: string[][] = [];
    for (const line of data.split("\n")) {
        map.push(line.split(""));
    }
    return map;
}

function findStartingPosition(map: string[][]): Position {
    // Find the starting position of the guard on the map
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (["^", "<", ">", "v"].includes(map[row][col])) {
                return { row: row, col: col, direction: map[row][col] };
            }
        }
    }
    return { row: -1, col: -1, direction: "" };
}

function moveGuard(map: string[][], curPos: Position): Position {
    // Move the guard on the map
    let newPos: Position = { row: -1, col: -1, direction: "" };
    switch (curPos.direction) {
        case "^":
            if (curPos.row === 0) break;
            if (map[curPos.row - 1][curPos.col] !== ".") {
                // Turn right
                if (curPos.col === map[curPos.row].length - 1) break;
                newPos = { row: curPos.row, col: curPos.col + 1, direction: ">" };
            } else {
                newPos = { row: curPos.row - 1, col: curPos.col, direction: "^" };
            }
            break;
        case "<":
            if (curPos.col === 0) break;
            if (map[curPos.row][curPos.col - 1] !== ".") {
                // Turn right
                if (curPos.row === 0) break;
                newPos = { row: curPos.row - 1, col: curPos.col, direction: "^" };
            } else {
                newPos = { row: curPos.row, col: curPos.col - 1, direction: "<" };
            }
            break;
        case ">":
            if (curPos.col === map[curPos.row].length - 1) break;
            if (map[curPos.row][curPos.col + 1] !== ".") {
                // Turn right
                if (curPos.row === map.length - 1) break;
                newPos = { row: curPos.row + 1, col: curPos.col, direction: "v" };
            } else {
                newPos = { row: curPos.row, col: curPos.col + 1, direction: ">" };
            }
            break;
        case "v":
            if (curPos.row === map.length - 1) break;
            if (map[curPos.row + 1][curPos.col] !== ".") {
                // Turn right
                if (curPos.col === 0) break;
                newPos = { row: curPos.row, col: curPos.col - 1, direction: "<" };
            } else {
                newPos = { row: curPos.row + 1, col: curPos.col, direction: "v" };
            }
            break;
    }
    if (newPos.row !== -1 && newPos.col !== -1) {
        // Update the map
        map[curPos.row][curPos.col] = ".";
        map[newPos.row][newPos.col] = newPos.direction;
    }
    return newPos;
}

function savePosition(position: Position, positions: Set<string>, includeDirection: boolean): void {
    // Save the position of the guard, with / without his direction
    if (includeDirection) {
        positions.add(`${position.row}, ${position.col}, ${position.direction}`);
    } else {
        positions.add(`${position.row}, ${position.col}`);
    }
}

if (import.meta.main) {
    // Read in the rules
    const map = readMap("./map.txt");
    // Part 1 of the challenge
    const originalMap = [...map.map((row) => [...row])];
    let position = findStartingPosition(originalMap);
    const positions: Set<string> = new Set();
    while (position.row !== -1 && position.col !== -1) {
        savePosition(position, positions, false);
        position = moveGuard(originalMap, position);
    }
    console.log(positions.size);
    // Part 2 of the challenge
    let obstacleCount = 0; // Number of obstacles
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            const obstacleMap = [...map.map((mapRow) => [...mapRow])];
            const positions2: Set<string> = new Set();
            position = findStartingPosition(obstacleMap);
            if (obstacleMap[row][col] !== ".") continue;
            obstacleMap[row][col] = "#";
            while (position.row !== -1 && position.col !== -1) {
                position = moveGuard(obstacleMap, position);
                if (positions2.has(`${position.row}, ${position.col}, ${position.direction}`)) {
                    obstacleCount += 1;
                    break;
                }
                savePosition(position, positions2, true);
            }
        }
    }
    console.log(obstacleCount);
}
