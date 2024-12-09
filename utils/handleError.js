// Define function
const handleHttpError = (res, message, code = 403) => {
    res.status(code).send(message)
};

// Exports
module.exports = { handleHttpError }