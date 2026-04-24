const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { auth, adminAuth } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const { search, category, level } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (level) query.level = level;

    const courses = await Course.find(query);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Admin: Create course
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Admin: Update course
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Admin: Delete course
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;