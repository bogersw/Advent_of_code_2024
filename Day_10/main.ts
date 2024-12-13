// Custom type with info about a point on the map
// (row, col, value)

type Point = {
    row: number;
    col: number;
    value: number;
};

function readMap(fileName: string): number[][] {
    // Read file with map data, return it as a 2D number array
    const data = Deno.readTextFileSync(fileName).split("\n");
    const map: number[][] = [];
    for (const line of data) {
        map.push(line.split("").map((el) => parseInt(el)));
    }
    return map;
}

function findTrailheads(map: number[][]): Point[] {
    // Determine all row/col indices of trailheads (trailhead has value 0).
    const trailHeads: Point[] = [];
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 0) trailHeads.push({ row: row, col: col, value: 0 });
        }
    }
    return trailHeads;
}

function move(map: number[][], point: Point): Point[] {
    // Determine all possible points that can be reached from the specified point.
    // If the value of the point is 9, we have reached an endpoint and we can return.
    const possiblePoints: Point[] = [];
    if (point.value === 9) return [];
    // Check up direction
    if (point.row !== 0) {
        if (map[point.row - 1][point.col] === point.value + 1) {
            possiblePoints.push({ row: point.row - 1, col: point.col, value: map[point.row - 1][point.col] });
        }
    }
    // Check down direction
    if (point.row !== map.length - 1) {
        if (map[point.row + 1][point.col] === point.value + 1) {
            possiblePoints.push({ row: point.row + 1, col: point.col, value: map[point.row + 1][point.col] });
        }
    }
    // Check left direction
    if (point.col !== 0) {
        if (map[point.row][point.col - 1] === point.value + 1) {
            possiblePoints.push({ row: point.row, col: point.col - 1, value: map[point.row][point.col - 1] });
        }
    }
    // Check right direction
    if (point.col !== map[point.row].length - 1) {
        if (map[point.row][point.col + 1] === point.value + 1) {
            possiblePoints.push({ row: point.row, col: point.col + 1, value: map[point.row][point.col + 1] });
        }
    }
    return possiblePoints;
}

function isPointInList(point: Point, points: Point[]): boolean {
    // Check if a point is already in the specified list: points should
    // be unique (yes, yes, I could have used a set for this). But for small
    // datasets this is ok.
    for (const p of points) {
        if (p.row === point.row && p.col === point.col && p.value === point.value) return true;
    }
    return false;
}

function trailScore(map: number[][], trailhead: Point): number {
    let score = 0;
    let trailPoints: Point[] = [];
    // Start with the trailhead
    trailPoints.push({ row: trailhead.row, col: trailhead.col, value: 0 });
    // Find all possible points on the trail
    while (trailPoints.length > 0) {
        const newPoints: Point[] = [];
        for (const point of trailPoints) {
            // Check for value 9, we have reached an endpoint then
            if (point.value === 9) score += 1;
            const nextPoints = move(map, point);
            // Only add unique points
            for (const point of nextPoints) {
                if (!isPointInList(point, newPoints)) newPoints.push(point);
            }
        }
        trailPoints = newPoints;
    }
    return score;
}

function trailRating(map: number[][], trailhead: Point): number {
    let rating = 0;
    let trailPoints: Point[] = [];
    // Start with the trailhead
    trailPoints.push({ row: trailhead.row, col: trailhead.col, value: 0 });
    // Find all possible points on the trail
    while (trailPoints.length > 0) {
        const newPoints: Point[] = [];
        for (const point of trailPoints) {
            // Check for value 9, we have reached an endpoint then
            if (point.value === 9) rating += 1;
            newPoints.push(...move(map, point));
        }
        trailPoints = newPoints;
    }
    return rating;
}

if (import.meta.main) {
    // Read in the map data
    const map = readMap("./map.txt");
    const trailHeads = findTrailheads(map);
    console.log(`Number of trailheads: ${trailHeads.length}`);
    // Part 1: sum of scores of all trailheads
    let sum = 0;
    for (const trailHead of trailHeads) {
        sum += trailScore(map, trailHead);
    }
    console.log(`Sum of scores of all trailheads (part 1): ${sum}`);
    // Part 2: sum of ratings of all trailheads
    sum = 0;
    for (const trailHead of trailHeads) {
        sum += trailRating(map, trailHead);
    }
    console.log(`Sum of ratings of all trailheads (part 2): ${sum}`);
}
