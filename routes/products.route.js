const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/product.controller.js");

router.get('/getAll', controller.getAllProduct)
router.get('/query', controller.getProductById)
router.get('/search', controller.searchProduct)

module.exports = router;
