const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  tutorEmail: { type: String, required: true, lowercase: true, trim: true },
  tutorName: { type: String, required: true },
  studentEmail: { type: String, required: true, lowercase: true, trim: true },
  studentName: { type: String, required: true },
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for fast queries
ratingSchema.index({ tutorEmail: 1 });
ratingSchema.index({ studentEmail: 1, tutorEmail: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
