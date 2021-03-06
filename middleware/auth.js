const jwt = require("jsonwebtoken");

function generateToken(data) {
  let accessToken = jwt.sign(data, process.env.jwtsecret, {
    expiresIn: process.env.accessTokenLife,
  });
  let refreshToken = jwt.sign(data, process.env.refreshTokenSecret, {
    expiresIn: process.env.refreshTokenLife,
  });
  return { accessToken, refreshToken };
}
async function verifyRefreshToken(token) {
  return await jwt.verify(token, process.env.refreshTokenSecret);
}
async function generateNewToken(data) {
  let accessToken = jwt.sign(data, process.env.jwtsecret, {
    expiresIn: process.env.accessTokenLife,
  });
  return accessToken;
}
async function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  // if (typeof bearerHeader !== "undefined") {
  //   // Split at the space
  //   const bearer = bearerHeader.split(" ");
  //   // Get token from array
  //   const bearerToken = bearer[1];
  //   // Set the token
  //   req.token = bearerToken;
  //   let verify = await jwt.verify(
  //     req.headers.authorization,
  //     process.env.jwtsecret
  //   );
  //   // Next middleware
  //   if (verify) {
  //     next();
  //   } else if (verify) {
  //     res.sendStatus(403);
  //   }
  // } else {
  //   // Forbidden
  //   res.sendStatus(403);
  // }
  try {
    let verify = await jwt.verify(
      req.headers.authorization,
      process.env.jwtsecret
    );
    await delete verify.password;
    req.user = verify;
    next();
  } catch (e) {
    res.send(e);
  }
}
module.exports = {
  generateToken,
  verifyToken,
  verifyRefreshToken,
  generateNewToken,
};
