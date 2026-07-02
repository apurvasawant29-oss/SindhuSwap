const bcrypt = require("bcryptjs");

const hashPassword = (password) => bcrypt.hash(password, 12);

module.exports = hashPassword;
