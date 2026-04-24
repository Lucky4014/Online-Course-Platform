const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ name, email, password });
    await user.save();

    // Send verification email
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = verificationToken;
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
    await transporter.sendMail({
      to: email,
      subject: 'Verify your email - Course Platform',
      html: `Please click <a href="${verificationUrl}">here</a> to verify your email.`
    });

    res.status(201).json({ msg: 'User registered. Please check your email.' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;