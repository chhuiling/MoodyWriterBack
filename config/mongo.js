// Imports
const mongoose = require("mongoose")

// Connection to DB
const dbConnect = () => {
    const db_uri = process.env.DB_URI;
    mongoose.set("strictQuery", false);
    try {
        mongoose.connect(db_uri);
    } catch (error) {
        console.error("Error connceting to DB: ", error);
    };

    mongoose.connection.on("connected", () => console.log("Succesfully connected to DB."));
};

// Exports
module.exports = dbConnect