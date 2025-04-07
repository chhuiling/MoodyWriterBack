// Imports
const mongoose = require("mongoose")
//const mongooseDelete = require("mongoose-delete")

// Create base schema for 'users' DB
const UsersSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        surname: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        birthdate: {
            type: Date
        },
        gender: {
            type: String,
            enum: ["Woman", "Man", "Other"],
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

//UsersSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Exports ('users' schema of DB)
module.exports = mongoose.model("users", UsersSchema);