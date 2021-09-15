const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const sequelize = new Sequelize(process.env.dbURL, {
  logging: false,
  query: { raw: true }
});
module.exports = sequelize;
