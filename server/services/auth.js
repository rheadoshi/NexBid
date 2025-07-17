const jwt = require('jsonwebtoken');

function generateAuthToken(userId) {
  const token = jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'your-secret-key', 
    { expiresIn: '7d' }
  );
  return token;
}

module.exports = {
  generateAuthToken
};