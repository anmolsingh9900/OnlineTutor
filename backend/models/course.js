const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  tutorId: String,
  tutorEmail: String,
  image: String,
  tutorName: String,
  name: String,
  about: String,
  time: String,
  fee: String,
  mobile: String
});

module.exports = mongoose.model("Course", courseSchema);