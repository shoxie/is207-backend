const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/product.controller.js");

router.get('/query', controller.getAllProduct)

module.exports = router;
