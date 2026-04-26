const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: String,
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  gender: String,
  dob: String,
  password: String,   // ✅ added
  purchasedCourses: [{
    courseId: String,
    courseName: String,
    tutorName: String,
    tutorEmail: String,
    fee: String,
    purchaseDate: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("User", userSchema);