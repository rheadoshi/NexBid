const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateAuthToken } = require('../services/auth');

// Register a new user
const register = async (req, res) => {
  const { username, email, password, role = 'user' } = req.body;

  // Enhanced validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  // Validate username
  if (username.length < 3 || username.length > 30) {
    return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  // Validate password strength
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  // Check for strong password
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;
  if (!strongPassword.test(password)) {
    return res.status(400).json({ 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds
    
    // Create new user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
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
    const token = generateAuthToken(user._id);
    
    // Return user data and token
    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
};