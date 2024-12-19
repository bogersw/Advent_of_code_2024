// Custom type to hold information about a point / patch in the garden.
// The id contains the letter of the patch, row / col its position and
// edges, left, top, right and bottom the number of edges and the position
// of the edges.
type Point = {
    id: string;
    row: number;
    col: number;
    edges: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
};

function readGardenData(fileName: string): string[][] {
    // Read file with garden data
    const data = Deno.readTextFileSync(fileName).split("\n");
    // Process the data line by line.
    const result: string[][] = [];
    for (const line of data) {
        result.push(line.split(""));
    }
    return result;
}

function nextPoint(row: number, col: number, maxRow: number, maxCol: number): [number, number] {
    // Utility function: when processing the map, return the next point on the map
    // given te current row and column.
    let newRow: number;
    let newCol: number;
    if (col < maxCol - 1) {
        newRow = row;
        newCol = col + 1;
    } else {
        if (row < maxRow - 1) {
            newRow = row + 1;
        } else {
            newRow = 0;
        }
        newCol = 0;
    }
    return [newRow, newCol];
}

function processPoint(region: Point[], point: Point, processedPoints: Set<string>): void {
    // Function to check if a point belongs in the specified region.
    if (region.length === 0) {
        region.push(point);
        processedPoints.add(`${point.row},${point.col}`);
    } else {
        if (
            region.some(
                (p) =>
                    (p.id === point.id && p.row === point.row - 1 && p.col === point.col) ||
                    (p.id === point.id && p.row === point.row && p.col === point.col - 1) ||
                    (p.id === point.id && p.row === point.row + 1 && p.col === point.col) ||
                    (p.id === point.id && p.row === point.row && p.col === point.col + 1)
            )
        ) {
            region.push(point);
            processedPoints.add(`${point.row},${point.col}`);
        }
    }
}

function findRegions(garden: string[][]): Map<number, Point[]> {
    // Initialize containers for processed points and regions
    const totalPointCount = garden.length * garden[0].length;
    const processedPoints: Set<string> = new Set();
    const regions: Map<number, Point[]> = new Map();
    // Initialize counters for current row, column and region
    let activeRow = 0;
    let activeCol = 0;
    let regionId = 0;
    // We check every individual point in the garden to check to which
    // region it belongs. Each row is processed twice (left-right, right-left)
    // in order to identify the regions to which points belong correctly.
    while (processedPoints.size < totalPointCount) {
        if (processedPoints.has(`${activeRow},${activeCol}`)) {
            [activeRow, activeCol] = nextPoint(activeRow, activeCol, garden.length, garden[0].length);
            continue;
        }
        const id = garden[activeRow][activeCol];
        const region: Point[] = [];
        // Repeat the following steps a couple of time to take regions
        // with funny shapes into account. A bit of a brute force approach,
        // maybe I'll revisit it at some later point.
        for (let repeat = 1; repeat <= 10; repeat++) {
            for (let row = 0; row < garden.length; row++) {
                // Step 1: process all points from left to right and assign them
                // to a region.
                for (let col = 0; col < garden[row].length; col++) {
                    if (processedPoints.has(`${row},${col}`)) continue;
                    if (garden[row][col] !== id) continue;
                    const point = { id: id, row: row, col: col, edges: 0, left: 0, top: 0, right: 0, bottom: 0 };
                    processPoint(region, point, processedPoints);
                }
                // Step 2: process all points from right to left and assign them
                // to a region.
                for (let col = garden[row].length - 1; col >= 0; col--) {
                    if (processedPoints.has(`${row},${col}`)) continue;
                    if (garden[row][col] !== id) continue;
                    const point = { id: id, row: row, col: col, edges: 0, left: 0, top: 0, right: 0, bottom: 0 };
                    processPoint(region, point, processedPoints);
                }
            }
        }
        if (region.length !== 0) {
            // Count edges for points in region
            for (let i = 0; i < region.length; i++) {
                const point = region[i];
                let edges = 4;
                let left = 1;
                let top = 1;
                let right = 1;
                let bottom = 1;
                for (let j = 0; j < region.length; j++) {
                    if (j === i) continue;
                    if (region[j].col === point.col && region[j].row === point.row - 1) {
                        edges -= 1;
                        top -= 1;
                    }
                    if (region[j].col === point.col && region[j].row === point.row + 1) {
                        edges -= 1;
                        bottom -= 1;
                    }
                    if (region[j].row === point.row && region[j].col === point.col - 1) {
                        edges -= 1;
                        left -= 1;
                    }
                    if (region[j].row === point.row && region[j].col === point.col + 1) {
                        edges -= 1;
                        right -= 1;
                    }
                }
                point.edges = edges;
                point.left = left;
                point.top = top;
                point.right = right;
                point.bottom = bottom;
            }
            // Save region and increase region counter
            regions.set(regionId, region);
            regionId += 1;
        }
        [activeRow, activeCol] = nextPoint(activeRow, activeCol, garden.length, garden[0].length);
    }
    return regions;
}

function challengePart1(regions: Map<number, Point[]>): number {
    let price = 0;
    for (const [_, points] of regions) {
        let perimeter = 0;
        const area = points.length;
        for (const point of points) perimeter += point.edges;
        price += area * perimeter;
    }
    return price;
}

function challengePart2(regions: Map<number, Point[]>): number {
    let price = 0;
    for (const [_, points] of regions) {
        const area = points.length;
        const left: string[] = [];
        const right: string[] = [];
        const top: string[] = [];
        const bottom: string[] = [];
        let numSides = 0;
        for (const point of points) {
            if (point.left === 1)
                left.push(`${point.col.toString().padStart(10, "0")}_${point.row.toString().padStart(10, "0")}`);
            if (point.right === 1)
                right.push(`${point.col.toString().padStart(10, "0")}_${point.row.toString().padStart(10, "0")}`);
            if (point.top === 1)
                top.push(`${point.row.toString().padStart(10, "0")}_${point.col.toString().padStart(10, "0")}`);
            if (point.bottom === 1)
                bottom.push(`${point.row.toString().padStart(10, "0")}_${point.col.toString().padStart(10, "0")}`);
        }
        // Sort points in ascending order (that's why the strings were padded with 0's, otherwise sorting goes wrong).
        left.sort();
        right.sort();
        top.sort();
        bottom.sort();
        // Count left sides
        let [colL, rowL] = left[0].split("_").map((el) => parseInt(el));
        for (let i = 0; i < left.length; i++) {
            const [newCol, newRow] = left[i].split("_").map((el) => parseInt(el));
            if (newCol !== colL || newRow !== rowL + 1) numSides += 1;
            colL = newCol;
            rowL = newRow;
        }
        // Count right sides
        let [colR, rowR] = right[0].split("_").map((el) => parseInt(el));
        for (let i = 0; i < right.length; i++) {
            const [newCol, newRow] = right[i].split("_").map((el) => parseInt(el));
            if (newCol !== colR || newRow !== rowR + 1) numSides += 1;
            colR = newCol;
            rowR = newRow;
        }
        // Count bottom sides
        let [rowB, colB] = bottom[0].split("_").map((el) => parseInt(el));
        for (let i = 0; i < bottom.length; i++) {
            const [newRow, newCol] = bottom[i].split("_").map((el) => parseInt(el));
            if (newRow !== rowB || newCol !== colB + 1) numSides += 1;
            colB = newCol;
            rowB = newRow;
        }
        // Count top sides
        let [rowT, colT] = top[0].split("_").map((el) => parseInt(el));
        for (let i = 0; i < top.length; i++) {
            const [newRow, newCol] = top[i].split("_").map((el) => parseInt(el));
            if (newRow !== rowT || newCol !== colT + 1) numSides += 1;
            colT = newCol;
            rowT = newRow;
        }
        // Update the price with the current region result
        price += area * numSides;
    }
    return price;
}

if (import.meta.main) {
    // Read in the garden data
    const garden = readGardenData("./garden.txt");
    // Identify the regions in the garden
    const regions = findRegions(garden);
    // Determine the total price for part 1 of the challenge
    const price = challengePart1(regions);
    console.log(`Price for part 1: ${price}.`);
    // Determine the total price for part 2 of the challenge
    const price2 = challengePart2(regions);
    console.log(`Price for part 2: ${price2}.`);
}
