const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/user.controller.js");

router.get("/refresh-token", controller.refreshToken);
router.post("/register", controller.createUser);
router.post("/login", controller.login);

module.exports = router;
