// user.js
const mongoose = require('mongoose');
const db = require("../config/db")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now },
  tokens: [{
    token: { type: String, required: true }
  }]
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Generate JWT token for authentication
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
