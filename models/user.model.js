const { Sequelize, Model, DataTypes } = require("sequelize");
let sequelize = require("./index.js");

var User = sequelize.define("User", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "user", allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false }
});

User.sync({ alter: true });

async function createUser(data) {
  let saveCall = await User.create(data);
  return saveCall;
}
async function getUser(data) {
  let user = await User.findOne({
    where: { username: data.username, password: data.password }
  });
  if (user) return user.dataValues;
  if (user === null) return user;
}
async function getAllUser() {
  let data = await User.findAll({ attributes: { exclude: ["password"] } });
  return data;
}
async function getUserVerify(data) {
  let userfound = await User.findOne({ where: { username: data } });
  return userfound;
}
module.exports = {
  createUser,
  getUser,
  getAllUser,
  getUserVerify
};
