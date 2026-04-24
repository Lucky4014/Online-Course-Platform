const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 }, // in seconds
  completed: { type: Boolean, default: false }
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String },
  modules: [moduleSchema],
  instructor: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);