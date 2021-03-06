const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/product.controller.js");

router.get("/", controller.getAllProduct);
router.get("/count", controller.getTotalCount);
router.get("/query", controller.getProductById);
router.get("/search", controller.searchProduct);
router.get("/related", controller.getRelatedProduct);
router.post("/", controller.postOneProduct);

module.exports = router;
