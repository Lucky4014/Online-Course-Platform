const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { auth } = require('../middleware/auth');

// Get user enrollments
router.get('/my', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title description price thumbnail')
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Update progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $push: { completedLessons: req.body }, progress: req.body.progress },
      { new: true }
    ).populate('course');
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;