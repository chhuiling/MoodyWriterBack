const express = require("express");
const { getAllPosts, getOnePost, createPost, updatePost, getWeekdaysMoodMedia, getSleepHoursMoodMedia, getTop5Activities, getBestActivity, getMostActiveDay} = require("../controllers/posts");
const uploadMiddlewareMemory = require("../utils/handleStorage");
const postsValidator = require("../validators/postsValidator");
const router = express.Router();
const parsePostMiddleware = require("../middleware/parsePost");

router.get("/user-post/:id", getAllPosts);
router.get("/:id", getOnePost);
router.post("/", uploadMiddlewareMemory.array("files", 5), parsePostMiddleware, postsValidator, createPost);
router.put("/:id", uploadMiddlewareMemory.array("files", 5), updatePost);
router.get("/get-weekdays-media/:id", getWeekdaysMoodMedia);
router.get("/get-sleep-hours-media/:id", getSleepHoursMoodMedia);
router.get("/get-top-5-activities/:id", getTop5Activities);
router.get("get-best-activity/:id", getBestActivity);
router.get("get-most-active-day/:id", getMostActiveDay);

module.exports = router;