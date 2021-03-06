const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/category.controller.js");

router.get('/', controller.getAllCategory)
router.get('/bySlug', controller.getCategoryBySlug)
router.post('/', controller.postNewCategory)
module.exports = router;
