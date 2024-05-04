/**  */
function calculateMedian(numbers) {
    const middleIndex = Math.floor(numbers.length / 2);
    if (numbers.length % 2 === 0) {
        return (numbers[middleIndex - 1] + numbers[middleIndex]) / 2;
    } else {
        return numbers[middleIndex];
    }
}

function calculateMode(numbers) {
    const counts = {};
    numbers.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
    });

    let maxCount = 0;
    let mode;
    for (const num in counts) {
        if (counts[num] > maxCount) {
        maxCount = counts[num];
        mode = parseFloat(num);
        }
    }
    if (maxCount === 1) return undefined;
    return mode;
}

module.exports = {
    calculateMedian,
    calculateMode
}