const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Create order
router.post('/order', auth, async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    
    const options = {
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await rzp.orders.create(options);
    res.json({ order });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature, courseId } = req.body;
    
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (signature === expectedSignature) {
      // Create enrollment
      const enrollment = new Enrollment({
        user: req.user._id,
        course: courseId,
        paymentId,
        orderId
      });
      await enrollment.save();

      // Send enrollment email
      const course = await Course.findById(courseId);
      await transporter.sendMail({
        to: req.user.email,
        subject: `Welcome to ${course.title}!`,
        html: `
          <h2>Enrollment Successful!</h2>
          <p>You have successfully enrolled in <strong>${course.title}</strong></p>
          <p>Payment ID: ${paymentId}</p>
          <p>Start learning now!</p>
        `
      });

      res.json({ success: true, enrollment });
    } else {
      res.status(400).json({ success: false, msg: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;