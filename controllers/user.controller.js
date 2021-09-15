let usermModel = require("../models/user.model.js");
var createError = require("http-errors");
let auth = require("../middleware/auth");
async function getAllUser(req, res, next) {
  if (!req.user.role === "administrator") {
    return next(createError(401, "Unauthorized"));
  }
  try {
    let userData = await usermModel.getAllUser();
    res.send(userData);
  } catch (e) {
    res.send(e);
  }
}
async function findUser(req, res, next) {
  try {
    let userData = await usermModel.getUser({ username: req.params.username });
    res.send(userData);
  } catch (e) {
    res.send(e);
  }
}
async function createUser(req, res, next) {
  let password = req.body.password;
  if (password.includes(" ")) {
    return next(createError(400, "No spaces in password."));
  }
  try {
    let data = {
      username: req.body.username,
      password: req.body.password,
      createdAt: Date.now(),
    };
    let aa = await usermModel.createUser(data);
    delete aa.password;
    res.send(aa);
  } catch (e) {
    res.send(e);
  }
}
async function login(req, res, next) {
  try {
    let data = {
      username: req.body.username,
      password: req.body.password,
    };
    let userData = await usermModel.getUser(data);
    if (userData === null)
      return next(createError(401, { lol: "This is the error" }));
    else {
      delete userData.password;
      userData.token = await auth.generateToken(userData);
      res.send(userData);
    }
  } catch (error) {
    res.send(error);
  }
}

module.exports = { getAllUser, findUser, createUser, login };
