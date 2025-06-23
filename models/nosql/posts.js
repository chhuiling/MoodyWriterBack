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
            type: Array,
            default: []
        },
        hobbies: {
            type: Array,
            default: []
        },
        food: {
            type: Array,
            default: []
        },
        social: {
            type: Array,
            default: []
        },
        productivity: {
            type: Array,
            default: []
        },
        chores: {
            type: Array,
            default: []
        },
        weather: {
            type: String,
            enum: ["Clear sky", "Cloudy", "Thunderstorm", "Drizzle", "Rain", "Snow", "Foggy or hazy", "Unknown"],
            default: "Unknown"
        },
        beauty: {
            type: Array,
            default: []
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