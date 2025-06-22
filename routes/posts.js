const express = require("express");
const { getAllPosts, getOnePost, createPost, updatePost, getWeekdaysMoodMedia, getSleepHoursMoodMedia, getTop5Activities, getBestActivity, getMostActiveDay, getEnergyAndSleepQuality, getMonthInformation, getActivitiesPreferencesByMood} = require("../controllers/posts");
const uploadMiddlewareMemory = require("../utils/handleStorage");
const postsValidator = require("../validators/postsValidator");
const router = express.Router();
const parsePostMiddleware = require("../middleware/parsePost");

/**
 * @swagger
 * /posts/user-post/{id}:
 *   get:
 *     summary: Get all posts for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of posts for the user
 */
router.get("/user-post/:id", getAllPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post data
 */
router.get("/:id", getOnePost);

/**
 * @swagger
 * /posts/:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: string
 *                 description: JSON stringified post data
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 5 image files
 *     responses:
 *       200:
 *         description: Post created successfully
 */
router.post("/", uploadMiddlewareMemory.array("files", 5), parsePostMiddleware, postsValidator, createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: string
 *                 description: JSON stringified post data
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Up to 5 image files
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put("/:id", uploadMiddlewareMemory.array("files", 5), updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete("/:id");

/**
 * @swagger
 * /posts/get-weekdays-media/{id}:
 *   get:
 *     summary: Get mood average per weekday for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Mood averages per weekday
 */
router.get("/get-weekdays-media/:id", getWeekdaysMoodMedia);

/**
 * @swagger
 * /posts/get-sleep-hours-media/{id}:
 *   get:
 *     summary: Get mood average per sleep hours for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Mood averages per sleep hours
 */
router.get("/get-sleep-hours-media/:id", getSleepHoursMoodMedia);

/**
 * @swagger
 * /posts/get-top-5-activities/{id}:
 *   get:
 *     summary: Get top 5 activities for a user in the last 30 days
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Top 5 activities
 */
router.get("/get-top-5-activities/:id", getTop5Activities);

/**
 * @swagger
 * /posts/get-best-activity/{id}:
 *   get:
 *     summary: Get the most frequent activity when mood is Ecstatic
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Most frequent activity for Ecstatic mood
 */
router.get("/get-best-activity/:id", getBestActivity);

/**
 * @swagger
 * /posts/get-most-active-day/{id}:
 *   get:
 *     summary: Get the day with the most activities for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Most active day
 */
router.get("/get-most-active-day/:id", getMostActiveDay);

/**
 * @swagger
 * /posts/get-energy-and-sleep-information/{id}:
 *   get:
 *     summary: Get arrays of energy and sleep quality for the last 30 days
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Arrays of energy and sleep quality
 */
router.get("/get-energy-and-sleep-information/:id", getEnergyAndSleepQuality);

/**
 * @swagger
 * /posts/get-month-information/{id}:
 *   get:
 *     summary: Get posts for a user for a specific month and year
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Month (1-12)
 *       - in: query
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Year (e.g. 2024)
 *     responses:
 *       200:
 *         description: Posts for the specified month and year
 */
router.get("/get-month-information/:id", getMonthInformation);

/**
 * @swagger
 * /posts/get-activities-preferences/{id}/{mood}:
 *   get:
 *     summary: Get activity preferences by mood for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: path
 *         name: mood
 *         required: true
 *         schema:
 *           type: string
 *         description: Mood (or "mean" for all moods)
 *     responses:
 *       200:
 *         description: Activity preferences by mood
 */
router.get("/get-activities-preferences/:id/:mood", getActivitiesPreferencesByMood);

module.exports = router;