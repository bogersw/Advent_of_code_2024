function readReports(fileName: string): number[][] {
    // Read textfile containing the reports
    const data = Deno.readTextFileSync(fileName);
    // Process the data line by line. Each line contains
    // a varying amount of numbers (levels) separated by 1 space.
    const reports: number[][] = [];
    for (const line of data.split("\n")) {
        const levels: string[] = line.split(" ");
        reports.push(levels.map((el) => parseInt(el)));
    }
    // Return the reports as an array of arrays of numbers
    // (the numbers represent levels in a report).
    return reports;
}

function levelsIncreasing(report: number[]): boolean {
    // Determine if levels in the specified report are
    // gradually increasing. This is one of the properties
    // of a safe report.
    return report.every((el, index) => {
        if (index === report.length - 1) return true;
        return el < report[index + 1];
    });
}

function levelsDecreasing(report: number[]): boolean {
    // Determine if levels in the specified report are
    // gradually decreasing. This is one of the properties
    // of a safe report.
    return report.every((el, index) => {
        if (index === report.length - 1) return true;
        return el > report[index + 1];
    });
}

function validLevelDifferences(report: number[]): boolean {
    // Check the levels in the report (i.e. the numbers in
    // the array): the difference between individual levels
    // should be >=1 and <=3. This is one of the properties
    // of a safe report.
    let validDifferences = true;
    report.forEach((element, index) => {
        if (index < report.length - 1) {
            const nextElement = report[index + 1];
            const difference = Math.abs(element - nextElement);
            if (difference < 1 || difference > 3) validDifferences = false;
        }
    });
    return validDifferences;
}

function countSafeReports(reports: number[][], problemDampener: boolean = false): number {
    // Definition of a safe report:
    // 1 - The levels are either all increasing or all decreasing.
    // 2 - Any two adjacent levels differ by at least one and at most three.
    // We can count the number of safe reports with or without the problem dampener.
    // If the problem dampener is enabled, we can check if a report can be made
    // safe by removing a single level. Otherwise, we check all the levels in a report.

    let numSafeReports = 0;
    for (const report of reports) {
        if ((levelsDecreasing(report) || levelsIncreasing(report)) && validLevelDifferences(report)) {
            // Safe report!
            numSafeReports += 1;
        } else {
            // If the problem dampener is disabled, we can stop
            // checking this report.
            if (!problemDampener) continue;
            // The problem dampener is enabled. Check if the report
            // can be made safe by removing a single level. We do this
            // by removing one level in the report at the tine and
            // checking if the resulting report is safe.
            for (let i = 0; i < report.length; i++) {
                const newReport = report.slice();
                newReport.splice(i, 1);
                if ((levelsDecreasing(newReport) || levelsIncreasing(newReport)) && validLevelDifferences(newReport)) {
                    numSafeReports += 1;
                    break;
                }
            }
        }
    }
    return numSafeReports;
}

if (import.meta.main) {
    // Read list of reports and count safe reports
    const reports = readReports("./reports.txt");
    // Count without problem dampener
    let numSafeReports = countSafeReports(reports);
    console.log(`Number of safe reports with problem dampener disabled: ${numSafeReports}`);
    // Count with problem dampener
    numSafeReports = countSafeReports(reports, true);
    console.log(`Number of safe reports with problem dampener enabled : ${numSafeReports}`);
}
