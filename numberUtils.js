// numberUtils.js
const fs = require('fs');

const ExpressError = require("./expressError");

function parseAndValidateNums(nums) {
    if (!nums) {
        throw new ExpressError('nums are required.', 400);
    }

    const numbers = nums.split(',').map(num => {
        const parsedNum = parseFloat(num);
        if (isNaN(parsedNum)) {
            throw new ExpressError(`${num} is not a valid number.`, 400);
        }
        return parsedNum;
    });

    return numbers;
}

async function saveResultIfRequested(operation, value, save) {
    if (save && save.toString().toLowerCase() === 'true') {
        const timestamp = new Date().toISOString();
        const data = { timestamp, operation, value };
        
        return new Promise((resolve, reject) => {
            fs.writeFile('results.json', JSON.stringify(data), err => {
                if (err) {
                    console.error('Error writing to file:', err);
                    reject(new Error('Failed to save result to file'));
                } else {
                    console.log('Result saved to results.json');
                    resolve();
                }
            });
        });
    } else {
        return Promise.resolve();
    }
}



module.exports = { 
    parseAndValidateNums,
    saveResultIfRequested
 };
  