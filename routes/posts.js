const express = require("express");
const { getAllPosts, getOnePost, createPost, updatePost} = require("../controllers/posts");
const uploadMiddlewareMemory = require("../utils/handleStorage");
const postsValidator = require("../validators/postsValidator");
const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getOnePost);
router.post("/", postsValidator, uploadMiddlewareMemory.array("files", 5), createPost);
router.put("/:id", uploadMiddlewareMemory.array("files", 5), updatePost);
router.delete("/:id");

module.exports = router;