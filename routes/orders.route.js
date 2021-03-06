const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/order.controller.js");

router.get('/', controller.getUserOrders)
router.get('/admin', controller.getAllOrders)
router.get('/shipping', controller.getShippingMethods)
router.post('/', controller.createOrder)
module.exports = router;
