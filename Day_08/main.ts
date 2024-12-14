// Custom type containing position info for antennas
// and antinodes.
type Position = {
    row: number;
    col: number;
};

function readMap(fileName: string): string[][] {
    // Read file with map data, return it as a 2D string array
    const data = Deno.readTextFileSync(fileName).split("\n");
    const map: string[][] = [];
    for (const line of data) {
        map.push(line.split(""));
    }
    return map;
}

function findAntennas(map: string[][]): Map<string, Position[]> {
    // Find all antennas in the map
    const antennas: Map<string, Position[]> = new Map();
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === ".") continue;
            // Check if antenna is already present
            if (antennas.has(map[row][col])) {
                antennas.get(map[row][col])!.push({ row: row, col: col });
            } else {
                antennas.set(map[row][col], [{ row: row, col: col }]);
            }
        }
    }
    return antennas;
}

function findAntinodes1(map: string[][], antennas: Map<string, Position[]>): Position[] {
    // Find all antinodes (part 1 of the challenge).
    const antiNodes: Set<string> = new Set();
    for (const antenna of antennas.keys()) {
        // For an antenna with a certain id, calculate antinodes for every possible pair.
        for (const position1 of antennas.get(antenna)!) {
            for (const position2 of antennas.get(antenna)!) {
                if (position1.row === position2.row && position1.col === position2.col) continue;
                // Calculate row / col shift for antinode
                const deltaRow = position2.row - position1.row;
                const deltaCol = position2.col - position1.col;
                if (
                    position2.row + deltaRow >= 0 &&
                    position2.row + deltaRow < map.length &&
                    position2.col + deltaCol >= 0 &&
                    position2.col + deltaCol < map[position2.row].length
                ) {
                    antiNodes.add(`${position2.row + deltaRow}, ${position2.col + deltaCol}`);
                }
            }
        }
    }
    // Return set as an array
    const result: Position[] = [];
    for (const antiNode of antiNodes) {
        const [row, col] = antiNode.split(",");
        result.push({ row: parseInt(row), col: parseInt(col) });
    }
    return result;
}

function findAntinodes2(map: string[][], antennas: Map<string, Position[]>): Position[] {
    // Find all antinodes (part 2 of the challenge).
    const antiNodes: Set<string> = new Set();
    for (const antenna of antennas.keys()) {
        // For an antenna with a certain id, calculate antinodes for every possible pair.
        for (const position1 of antennas.get(antenna)!) {
            for (const position2 of antennas.get(antenna)!) {
                if (position1.row === position2.row && position1.col === position2.col) continue;
                // Calculate row / col shift for antinode
                const deltaRow = position2.row - position1.row;
                const deltaCol = position2.col - position1.col;
                antiNodes.add(`${position2.row}, ${position2.col}`);
                // Now find all positions that are on the line by adding deltaRow and deltaCol
                // until the coordinates are out of bounds.
                let row = position2.row;
                let col = position2.col;
                while (
                    row + deltaRow >= 0 &&
                    row + deltaRow < map.length &&
                    col + deltaCol >= 0 &&
                    col + deltaCol < map[row].length
                ) {
                    row += deltaRow;
                    col += deltaCol;
                    antiNodes.add(`${row}, ${col}`);
                }
            }
        }
    }
    // Return set as an array
    const result: Position[] = [];
    for (const antiNode of antiNodes) {
        const [row, col] = antiNode.split(",");
        result.push({ row: parseInt(row), col: parseInt(col) });
    }
    return result;
}

if (import.meta.main) {
    // Read in the map with antennas
    const map = readMap("./antenna_map.txt");
    // Find the locations / coordinates of the antennas
    const antennas = findAntennas(map);
    // Part 1: number of unique locations with an antinode (2 per antenna pair)
    const antiNodes1 = findAntinodes1(map, antennas);
    console.log(`Part 1: ${antiNodes1.length} unique locations with an antinode.`);
    // Part 2: number of unique locations with an antinode (multiple per antenna pair)
    const antiNodes2 = findAntinodes2(map, antennas);
    console.log(`Part 2: ${antiNodes2.length} unique locations with an antinode.`);
}
