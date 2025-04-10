// Define function
const handleHttpError = (res, message, code = 500) => {
    res.status(code).send(message)
};

// Exports
module.exports = { handleHttpError }