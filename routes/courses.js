const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Admin only)
router.post('/', [
  auth,
  adminAuth,
  body('title', 'Title is required').not().isEmpty(),
  body('description', 'Description is required').not().isEmpty(),
  body('instructor', 'Instructor is required').not().isEmpty(),
  body('duration', 'Duration is required').not().isEmpty(),
  body('category', 'Category is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = new Course(req.body);
    await course.save();
    res.json(course);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json({ message: 'Course removed' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/complete
// @desc    Mark course as completed for user
// @access  Private
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Check if course is already completed
    const alreadyCompleted = user.completedCourses.find(
      completed => completed.courseId.toString() === req.params.id
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Course already completed' });
    }

    // Add course to completed courses
    user.completedCourses.push({
      courseId: req.params.id,
      completedAt: new Date()
    });
    
    await user.save();
    
    res.json({ message: 'Course marked as completed', course });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/user/completed
// @desc    Get user's completed courses
// @access  Private
router.get('/user/completed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('completedCourses.courseId');
    res.json(user.completedCourses);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 