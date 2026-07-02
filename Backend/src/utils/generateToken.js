const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "sindhuswap-dev-secret", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

module.exports = generateToken;
