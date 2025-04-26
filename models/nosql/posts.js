// Imports
const mongoose = require("mongoose")
//const mongooseDelete = require("mongoose-delete")

// Create base schema for 'users' DB
const PostsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'usersModel',
        },
        mood: {
            type: String,
            enum: ["Miserable", "Sad", "Neutral", "Happy", "Ecstatic"]
        },
        emotions: {
            type: Array
        },
        //type: String // Debe de tener un campo hours que seria string y quality que seria int
        // Cambiar sleep por sleepHours y sleepQuality
        sleepHours: {
            type: String
        },
        sleepQuality: {
            type: Number
        },
        // energy: {type: Number},
        energy: {
            type:Number
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
            type: String
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

//PostsSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Exports ('users' schema of DB)
module.exports = mongoose.model("posts", PostsSchema);