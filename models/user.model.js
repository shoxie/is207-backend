// const { Sequelize, Model, DataTypes } = require("sequelize");
// let sequelize = require("./index.js");

// var User = sequelize.define("User", {
//   id: {
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//     type: DataTypes.INTEGER
//   },
//   username: { type: DataTypes.STRING, allowNull: false, unique: true },
//   password: { type: DataTypes.STRING, allowNull: false },
//   role: { type: DataTypes.STRING, defaultValue: "user", allowNull: false },
//   createdAt: { type: DataTypes.DATE, allowNull: false }
// });

// User.sync({ alter: true });

// async function createUser(data) {
//   let saveCall = await User.create(data);
//   return saveCall;
// }
// async function getUser(data) {
//   let user = await User.findOne({
//     where: { username: data.username, password: data.password }
//   });
//   if (user) return user.dataValues;
//   if (user === null) return user;
// }
// async function getAllUser() {
//   let data = await User.findAll({ attributes: { exclude: ["password"] } });
//   return data;
// }
// async function getUserVerify(data) {
//   let userfound = await User.findOne({ where: { username: data } });
//   return userfound;
// }

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateToken } = require("../middleware/auth");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

var User = mongoose.model("User", userSchema);

async function createUser(user) {
  let data = new User(user);
  return await data.save().then((createdUser) => {
    return generateToken(user);
  });
}

async function getUser(user) {
  try {
    let target = await User.findOne({
      username: user.username,
      password: user.password,
    });
    return generateToken(user);
  } catch (e) {
    return e;
  }
}

module.exports = {
  createUser,
  getUser,
  // getAllUser,
  // getUserVerify,
};
