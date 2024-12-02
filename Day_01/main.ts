function readLocations(fileName: string): [number[], number[]] {
    // Read textfile containing the locations
    const data = Deno.readTextFileSync(fileName);
    // Process data line by line. Each line contains
    // two numbers separated by 3 spaces.
    const locations1: number[] = [];
    const locations2: number[] = [];
    for (const line of data.split("\n")) {
        const locations = line.split("   ");
        locations1.push(parseInt(locations[0]));
        locations2.push(parseInt(locations[1]));
    }
    return [locations1, locations2];
}

function calculateTotalDistance(locations1: number[], locations2: number[]): number {
    // First sort the arrays in ascending order
    locations1.sort((a, b) => a - b);
    locations2.sort((a, b) => a - b);
    // Calculate the (absolute) distance between each pair of numbers
    // and calculate the sum of those distances
    let totalDistance: number = 0;
    for (let i = 0; i < locations1.length; i++) {
        totalDistance += Math.abs(locations1[i] - locations2[i]);
    }
    return totalDistance;
}

function calculateSimilarityScore(locations1: number[], locations2: number[]): number {
    // Lopp over the locations in the first list and determine the frequency
    // of each location in the second list: the multiply the location with the
    // frequency and add the result to the similarity score.
    let similarityScore: number = 0;
    for (let i = 0; i < locations1.length; i++) {
        const frequency = locations2.filter((location) => location === locations1[i]).length;
        similarityScore += locations1[i] * frequency;
    }
    return similarityScore;
}

if (import.meta.main) {
    // Get both lists of locations
    const [locations1, locations2] = readLocations("./locations.txt");
    // Calculate the total distance and the similarity score
    const totalDistance = calculateTotalDistance(locations1, locations2);
    const similarityScore = calculateSimilarityScore(locations1, locations2);
    console.log(`Total distance: ${totalDistance}`);
    console.log(`Similarity score: ${similarityScore}`);
}
