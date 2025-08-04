const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificateId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: true
  },
  certificateUrl: {
    type: String
  },
  completionDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
