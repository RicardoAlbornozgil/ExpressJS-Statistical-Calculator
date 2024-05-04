/** Express app with routes for statistical calculations of mean, median and mode. */

const express = require('express');
const ExpressError = require("./expressError");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { calculateMedian, calculateMode } = require('./calculations');
const { parseAndValidateNums, saveResultIfRequested } = require('./numberUtils');

// Mean route
app.get('/mean', async (req, res, next) => {
    try {
        if (!req.query.nums) {
            throw new ExpressError('nums are required.', 400);
        }
        const numbers = parseAndValidateNums(req.query.nums);
        
        const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
        await saveResultIfRequested('mean', mean, req.query.save);
        res.json({ operation: 'mean', value: mean });
    } catch (error) {
        next(error);
    }
});

// Median route
app.get('/median', async (req, res, next) => {
    try {
        if (!req.query.nums) {
            throw new ExpressError('nums are required.', 400);
        }
        const numbers = parseAndValidateNums(req.query.nums);
        if (numbers.some(isNaN)) throw new ExpressError('Invalid numbers provided.', 400);
        numbers.sort((a, b) => a - b);
        const median = calculateMedian(numbers);
        await saveResultIfRequested('median', median, req.query.save);
        res.json({ operation: 'median', value: median });
    } catch (error) {
        next(error);
    }
});

// Mode route
app.get('/mode', async (req, res, next) => {
    try {
        if (!req.query.nums) {
            throw new ExpressError('nums are required.', 400);
        }
        const numbers = parseAndValidateNums(req.query.nums);
        if (numbers.some(isNaN)) throw new ExpressError('Invalid numbers provided.', 400);
        const mode = calculateMode(numbers);
        await saveResultIfRequested('mode', mode, req.query.save);
        res.json({ operation: 'mode', value: mode });
    } catch (error) {
        next(error);
    }
});

// All operations route
app.get('/all', async (req, res, next) => {
  try {
        if (!req.query.nums) {
            throw new ExpressError('nums are required.', 400);
        }
        const numbers = parseAndValidateNums(req.query.nums);
        if (numbers.some(isNaN)) throw new ExpressError('Invalid numbers provided.', 400);
        const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
        numbers.sort((a, b) => a - b);
        const median = calculateMedian(numbers);
        const mode = calculateMode(numbers);
        const result = { operation: 'all', mean, median, mode };
        await saveResultIfRequested('all', result, req.query.save);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use(function (error, req, res, next) {
    let status = error.status || 500;
    let message = error.message;
    console.log(status, message);
    return res.status(status).json({ error: { message, status } });
});

const port = process.env.PORT || 3000; // Use the port provided by environment variable or default to 3000

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app; // Export the Express app instance
