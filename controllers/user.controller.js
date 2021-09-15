let userModel = require("../models/user.model.js");
const { validatePassword } = require("./../utils/validateString");
var createError = require("http-errors");
const {
  verifyRefreshToken,
  generateToken,
  generateNewToken,
} = require("../middleware/auth");

async function getAllUser(req, res, next) {
  if (!req.user.role === "administrator") {
    return next(createError(401, "Unauthorized"));
  }
  try {
    let userData = await userModel.getAllUser();
    res.send(userData);
  } catch (e) {
    res.send(e);
  }
}
async function findUser(req, res, next) {
  try {
    let userData = await userModel.getUser({ username: req.params.username });
    res.send(userData);
  } catch (e) {
    res.send(e);
  }
}
async function createUser(req, res, next) {
  let password = req.body.password;
  let validate;
  if (!password) {
    return res.status(400).send({
      message: "Password is required",
    });
  } else if (password && password.includes(" ")) {
    return res.status(400).send({
      message: "Password cannot contain spaces",
    });
  } else if (!validatePassword(password)) {
    return res.status(400).send({
      message:
        "Password must contain at least 8 characters, including atleast 1 number",
    });
  } else {
    try {
      let data = {
        username: req.body.username,
        password: req.body.password,
      };
      let token = await userModel.createUser(data);
      res.status(200).send(token);
    } catch (e) {
      res.send(e);
    }
  }
}
async function login(req, res, next) {
  try {
    let data = {
      username: req.body.username,
      password: req.body.password,
    };
    let userData = await userModel.getUser(data);
    console.log(`userData`, userData);
    if (userData === null)
      return res.status(400).send({ message: "User not found" });
    else return res.status(200).send(userData);
  } catch (error) {
    res.send(error);
  }
}

async function refreshToken(req, res, next) {
  let token = req.body.refreshToken;
  if (!token) return res.status(400).send({ message: "Token is required" });
  else {
    try {
      let verifier = await verifyRefreshToken(token);
      console.log(`verifier`, verifier);
      let tokens = await generateNewToken({
        username: verifier.username,
        password: verifier.password,
      });
      console.log(`tokens`, tokens);
      return res.status(200).send({ accessToken: tokens });
    } catch (e) {
      return res.status(400).send({ message: "Token is expired" });
    }
  }
}

module.exports = { getAllUser, findUser, createUser, login, refreshToken };
