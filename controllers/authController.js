// authController.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;





exports.register = async (req, res, next) => {
  const { email, password } = req.body
  if (password.length < 4) {
    return res.status(400).json({ message: "Password less than 4 characters" })
  }
  try {
    await User.create({
      email,
      password,
    }).then(user =>
      res.status(200).json({
        message: "User successfully created",
        user,
      })
    )
  } catch (err) {
    res.status(401).json({
      message: "User not successful created",
      error: error.mesage,
    })
  }
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Login not successful",
        error: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

/*exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email or Password not present",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Login not successful",
        error: "Invalid password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}; */






