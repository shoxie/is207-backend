const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/banner.controller.js");

router.get('/', controller.getBanners)

module.exports = router;
