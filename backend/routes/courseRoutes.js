const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/user");

const multer = require("multer");
const path = require("path");
const { uploadToGitHub } = require("../utils/githubUpload");

// 🔥 MULTER CONFIG: Store in memory instead of local disk
const storage = multer.memoryStorage();
const upload = multer({ storage });


// 🚀 ADD COURSE
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { tutorName, name, about, time, fee } = req.body;

    console.log("📝 Course Add Request:", { tutorName, name, about, time, fee, hasImage: !!req.file });

    const tutor = await User.findOne({ name: tutorName });

    if (!tutor) {
      console.error("❌ Tutor not found:", tutorName);
      return res.status(404).json({ message: "Tutor not found", tutorName });
    }

    let imageUrl = "";
    if (req.file) {
      console.log("🖼️ Uploading image:", req.file.originalname);
      try {
        imageUrl = await uploadToGitHub(req.file.buffer, req.file.originalname);
        console.log("✅ Image uploaded:", imageUrl);
      } catch (uploadErr) {
        console.error("❌ GitHub upload failed:", uploadErr.message);
        return res.status(500).json({ error: "Image upload failed: " + uploadErr.message });
      }
    }

    const course = new Course({
      tutorName,
      tutorEmail: (tutor.email || "").toLowerCase().trim(),
      name,
      about,
      time,
      fee,
      mobile: tutor.mobile,
      image: imageUrl
    });

    await course.save();
    console.log("✅ Course saved:", course._id);
    res.json(course);

  } catch (err) {
    console.error("❌ Error adding course:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
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
      updateData.image = await uploadToGitHub(req.file.buffer, req.file.originalname);
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