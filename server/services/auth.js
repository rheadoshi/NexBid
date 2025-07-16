const jwt = require('jsonwebtoken');

const generateAuthToken = function () {
  const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET);
  return token;
}

module.exports = { generateAuthToken };