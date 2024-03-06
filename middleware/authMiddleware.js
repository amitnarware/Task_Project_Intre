const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const User = require('../models/user');

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findOne({ _id: decoded.userId, 'tokens.token': token });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};


