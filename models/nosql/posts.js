// Imports
const mongoose = require("mongoose")
const mongooseDelete = require("mongoose-delete")

// Create base schema for 'users' DB
const PostsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usersModel',
        },
        mood: {
            type: String,
            enum: ["Very sad", "Sad", "Neutral", "Happy", "Very happy"]
        },
        emotions: {
            type: Array
        },
        sleep: {
            type: String
        },
        health: {
            type: Array
        },
        hobbies: {
            type: Array
        },
        food: {
            type: Array
        },
        social: {
            type: Array
        },
        productivity: {
            type: Array
        },
        chores: {
            type: Array
        },
        weather: {
            type: Array
        },
        beauty: {
            type: Array
        },
        text: {
            type: String
        },
        images: {
            type: Array
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

PostsSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Exports ('users' schema of DB)
module.exports = mongoose.model("posts", PostsSchema);