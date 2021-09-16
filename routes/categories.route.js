const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/category.controller.js");

router.get('/getAll', controller.getAllCategory)

module.exports = router;
