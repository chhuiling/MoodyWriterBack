// Imports
const bcryptjs = require("bcryptjs")

// Define functions
const encrypt = async (password) => {
    return await bcryptjs.hash(password, 10)
};

const compare = async (password, hashedPassword) => {
    return await bcryptjs.compare(password, hashedPassword)
};

// Exports
module.exports = { encrypt, compare }