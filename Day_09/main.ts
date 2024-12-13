// Custom type with info about a file
// (starting position on disk and file length)
type FileInfo = {
    startIndex: number;
    length: number;
};

function readDenseData(fileName: string): string {
    // Read file with dense disk data
    return Deno.readTextFileSync(fileName);
}

function processDenseData(denseData: string): [number[], Map<number, FileInfo>] {
    // The input data is a coded string. Here we decode the
    // data and convert it to an array of numbers representing
    // the disk. Note that -1 stands for free space, other numbers
    // represent file ids.
    const data = denseData.split("").map((el) => parseInt(el));
    const result: number[] = [];
    const fileInfo: Map<number, FileInfo> = new Map();
    let fileId = 0;
    let startIndex = 0;
    for (const [index, value] of data.entries()) {
        if (index % 2 === 0) {
            // Even index => file block(s)
            fileInfo.set(fileId, { startIndex: startIndex, length: value });
            result.push(...new Array(value).fill(fileId));
            fileId += 1;
            startIndex += value;
        } else {
            // Odd index => free space block(s)
            if (value !== 0) {
                result.push(...new Array(value).fill(-1));
                startIndex += value;
            }
        }
    }
    // Return the expanded data and a Map with information about the files.
    return [result, fileInfo];
}

function defragmentDisk(disk: number[]): number {
    // Part 1 of the challenge: start from the end with the highest
    // file id and search for the first empty space from the beginning.
    for (let i = disk.length - 1; i >= 0; i--) {
        if (disk[i] !== -1) {
            const index = disk.indexOf(-1);
            if (index === -1 || index >= i) break;
            disk[index] = disk[i];
            disk[i] = -1;
        }
    }
    // Calculate the checksum and return it
    return disk.reduce((acc, curr, index) => {
        if (curr !== -1) {
            acc += curr * index;
        }
        return acc;
    }, 0);
}

function defragmentDisk2(disk: number[], fileInfo: Map<number, FileInfo>): number {
    // Part 2 of the challenge. We start with the highest file id and search
    // for empty space that is big enough to hold our entire file: we then move
    // our file. We make use of out fileInfo Map to find out where we are and
    // how many free space we need for a specific file.

    // Get largest fileId from map
    const maxFileId = Math.max(...fileInfo.keys());
    // Work from the end to the beginning and try to move the files.
    for (let fileId = maxFileId; fileId >= 0; fileId--) {
        const currentFile = fileInfo.get(fileId)!;
        for (let i = 0; i <= currentFile.startIndex - currentFile.length; i++) {
            // Check if the sum of free spaces is equal to the negative length of the file.
            // This means that the file can be moved here.
            if (
                disk.slice(i, i + currentFile.length).reduce((acc, curr) => acc + curr, 0) ===
                currentFile.length * -1
            ) {
                // Move the file and fill the "old" file positions with -1 (empty space).
                disk.fill(fileId, i, i + currentFile.length);
                disk.fill(-1, currentFile.startIndex, currentFile.startIndex + currentFile.length);
                break;
            }
        }
    }
    // Calculate the checksum and return it
    return disk.reduce((acc, curr, index) => {
        if (curr !== -1) {
            acc += curr * index;
        }
        return acc;
    }, 0);
}

if (import.meta.main) {
    // Read in the dense disk data
    const denseData = readDenseData("./disk_map.txt");
    // Convert the dense data to a disk map (files / empty space).
    // Also get information about the files in the form of a Map.
    const [disk, fileInfo] = processDenseData(denseData);
    // Now defragment the disk and move files bit by bit (part 1)
    let result = defragmentDisk([...disk]);
    console.log(`The checksum for part 1 is: ${result}`);
    // Now defragment the disk and move files as a whole (part 2)
    result = defragmentDisk2([...disk], fileInfo);
    console.log(`The checksum for part 2 is: ${result}`);
}
