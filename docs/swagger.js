const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Tracks - Express API with Swagger (OpenAPI 3.0)",
            version: "0.1.0",
            description: "This is a CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "moody writer",
                url: "",
                email: "moodywriter.immune@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000/api",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer"
                },
            },
            schemas: {
                Users: {
                    type: "object",
                    required: ["name", "surname", "email", "password", "birthdate", "gender"],
                    properties: {
                        name: {
                            type: "string",
                            description: "User name",
                            example: "Noam"
                        },
                        surname: {
                            type: "string",
                            description: "User surname",
                            example: "comoseapellidanoam?"
                        },
                        email: {
                            type: "string",
                            unique: true,
                            description: "User email",
                            example: "noamcorreo@gmail.com"
                        },
                        password: {
                            type: "string",
                            description: "User password",
                            example: "contraseñamuysegura123"
                        },
                        birthdate: {
                            type: "string",
                            format: "date",
                            description: "User birthdate",
                            example: new Date()
                        },
                        gender: {
                            type: "string",
                            description: "User gender",
                            required: ["Woman", "Man", "Other"],
                            example: "Other"
                        }
                    },
                },
                Posts: {
                    type: "object",
                    required: ["userId", "mood"],
                    properties: {
                        userId: {
                            type: "string",
                            pattern: '^[a-fA-F0-9]{24}$',
                            example: '60c72b2f5f1b2c001c8e4b5e',
                            description: "MongoDB ObjectId"
                        },
                        mood: {
                            type: "string",
                            required: ["Miserable", "Sad", "Neutral", "Happy", "Ecstatic"],
                            description: "Post main mood",
                            example: "Miserable"
                        },
                        emotions: {
                            type: "array",
                            description: "Post array of emotions",
                            items: {
                                type: "string",
                                example: "Averse"
                            },
                            example: ["Averse", "Disappointed"]
                        },
                        sleepHours: {
                            type: "string",
                            required: ["0", "1to4", "5to7", "8to10", "more10"],
                            description: "Post sleep hours",
                            example: "0"
                        },
                        sleepQuality: {
                            type: "number",
                            description: "Post quality rating of sleep, 0 to 100",
                            example: 15
                        },
                        energy: {
                            type: "number",
                            description: "Post quality rating of energy, 0 to 100",
                            example: 15
                        },
                        health: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Gym"
                            },
                            description: "Post array of activities done about Health",
                            example: ["Gym", "Yoga", "Drink water"]
                        },
                        hobbies: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Draw"
                            },
                            description: "Post array of activities done about Hobbies",
                            example: ["Draw", "Play games", "Travel"]
                        },
                        food: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Fast food"
                            },
                            description: "Post array of activities done about Food",
                            example: ["Fast food", "Delivery", "Restaurant"]
                        },
                        social: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Party"
                            },
                            description: "Post array of activities done about Social",
                            example: ["Party", "Date", "Friends"]
                        },
                        productivity: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Homework"
                            },
                            description: "Post array of activities done about Productivity",
                            example: ["Homework", "Work", "Focus"]
                        },
                        chores: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Groceries"
                            },
                            description: "Post array of activities done about Chores",
                            example: ["Groceries", "Laundry", "Cleaning"]
                        },
                        weather: {
                            type: "string",
                            description: "Post today's weather forecast description, user needs to activate location permission.",
                            example: "Rainy"
                        },
                        beauty: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "Skincare"
                            },
                            description: "Post array of activities done about Self-care",
                            example: ["Skincare", "Meditation", "Shopping"]
                        },
                        text: {
                            type: "string",
                            description: "Post user input diary",
                            example: "Today I ate pizza. Me happy."
                        },
                        images: {
                            type: "array",
                            items: {
                                type: "string",
                                example: "https://pinata-image1.com"
                            },
                            description: "Post array of url to images in pinata",
                            example: ["https://pinata-image1.com", "https://pinata-image2.com"]
                        }
                    }
                },
            },
        },
    },
    apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);