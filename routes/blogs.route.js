const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/blog.controller.js");

router.get('/', controller.getBlogs)
router.post('/', controller.createBlog)

module.exports = router;
