const {
  validatePassword,
  validateEmail,
} = require("./../utils/validateString");
var createError = require("http-errors");
const {
  verifyRefreshToken,
  generateToken,
  generateNewToken,
} = require("../middleware/auth");
const prisma = require("../models/index");

function createUser(req, res, next) {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return next(createError(400, "Missing fields"));
  }
  try {
    const emailCheck = validateEmail(email);
    if (password.length < 8) {
      return res
        .status(400)
        .send({ message: "Password must be at least 8 characters long" });
    }
    if (!emailCheck) {
      return res.status(400).send({ message: "Email is not valid" });
    }
    prisma.user
      .create({ data: req.body })
      .then((result) => {
        let tokens = generateToken({
          username: result.username,
          password: result.password,
          role: result.role,
        });
        return res
          .status(201)
          .send({ message: `User ${result.username} created`, tokens });
      })
      .catch((err) => {
        return res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

function login(req, res, next) {
  const { email, username, password } = req.body;
  prisma.user
    .findFirst({
      where: {
        OR: [
          {
            email: {
              equals: email,
            },
          },
          {
            username: {
              equals: username,
            },
          },
        ],
        password: {
          equals: password,
        },
      },
    })
    .then((result) => {
      let { accessToken, refreshToken } = generateToken({
        username: result.username,
        password: result.password,
        role: result.role,
      });
      return res.status(200).send({
        username: result.username,
        role: result.role,
        accessToken,
        refreshToken,
      });
    })
    .catch((err) => res.status(400).send({ message: err.message }));
}

async function refreshToken(req, res, next) {
  if (!req.body.refreshToken) {
    return res.status(400).send({ message: "Missing refresh token" });
  }

  try {
    let user = await verifyRefreshToken(req.body.refreshToken);
    let accessToken = await generateNewToken({
      username: user.username,
      password: user.password,
      role: user.role,
    });
    return res.status(200).send({ accessToken });
  } catch (err) {
    return res.status(400).send({ message: "Refresh token expired" });
  }
}

module.exports = { createUser, login, refreshToken };
