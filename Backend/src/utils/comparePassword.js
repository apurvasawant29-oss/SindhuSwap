const bcrypt = require("bcryptjs");

const comparePassword = (plainPassword, hashedPassword) =>
  bcrypt.compare(plainPassword, hashedPassword);

module.exports = comparePassword;
