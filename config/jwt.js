// jwt.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
