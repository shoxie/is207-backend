const express = require("express");
const router = express.Router();
let auth = require("../middleware/auth").verifyToken;
let controller = require("../controllers/user.controller.js");

/* GET users listing. */
// router.get("/", auth, controller.findAllUser);
// router.get("/:username", auth, controller.findUser);
router.post("/register", controller.createUser);
router.post("/login", controller.login);
module.exports = router;
