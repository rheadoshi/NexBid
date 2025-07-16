const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateAuthToken } = require('../services/auth');

// Register a new user
const register = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    
    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {    
      return res.status(400).json({ message: 'User not found' });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    // Generate JWT token
    const token = generateAuthToken();
    // Return user data and token
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
        token, })
    }
    catch (error) {
      console.error('Error logging in user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
  register,
  login,
};