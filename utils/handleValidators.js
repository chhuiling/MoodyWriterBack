// Imports
const { validationResult } = require("express-validator")

// Define functions
const validateResults = (req, res, next) => {
    try { // Validate results and send to next process
        validationResult(req).throw();
        return next();
    } catch (err) { // Throw list of not matches
        res.status(403);
        res.send({ errors: err.array() });
    };
};

// Exports
module.exports = validateResults