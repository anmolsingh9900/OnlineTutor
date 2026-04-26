const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/user");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔥 ABSOLUTE UPLOAD PATH
const uploadPath = path.join(__dirname, "../uploads");

// 🔥 MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// 🚀 ADD COURSE
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { tutorName, name, about, time, fee } = req.body;

    const tutor = await User.findOne({ name: tutorName });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const course = new Course({
      tutorName,
      tutorEmail: (tutor.email || "").toLowerCase().trim(),
      name,
      about,
      time,
      fee,
      mobile: tutor.mobile,
      image: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await course.save();
    res.json(course);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🚀 UPDATE COURSE (NEW 🔥)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, about, time, fee } = req.body;

    const updateData = {
      name,
      about,
      time,
      fee,
    };

    // ✅ if new image uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after" }
    );

    res.json(updatedCourse);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🚀 GET ALL COURSES
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🚀 DELETE COURSE
router.delete("/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;