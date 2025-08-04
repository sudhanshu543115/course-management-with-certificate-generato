const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Course+Image'
  },
  content: [{
    title: String,
    description: String,
    videoUrl: String,
    duration: String
  }],
  requirements: [String],
  learningOutcomes: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema); 