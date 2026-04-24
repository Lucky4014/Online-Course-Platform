const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  paymentId: { type: String, required: true },
  orderId: { type: String, required: true },
  progress: { type: Number, default: 0 }, // percentage
  completedLessons: [{ 
    moduleIndex: Number, 
    lessonIndex: Number 
  }],
  enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);