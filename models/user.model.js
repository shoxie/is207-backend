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
    let tokens = generateToken(user)
    var data = {
      ...tokens,
      username: target.username
    }
    return data;
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
