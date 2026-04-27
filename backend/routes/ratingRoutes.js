const express = require("express");
const router = express.Router();
const Rating = require("../models/rating");
const User = require("../models/user");

// ✅ SUBMIT OR UPDATE RATING (only for students who purchased the course)
router.post("/submit-rating", async (req, res) => {
  try {
    const { tutorEmail, tutorName, studentEmail, studentName, courseId, courseName, rating, review } = req.body;

    // Validate input
    if (!tutorEmail || !studentEmail || !courseId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Normalize emails (lowercase & trim)
    const normalizedStudentEmail = studentEmail.toLowerCase().trim();
    const normalizedTutorEmail = tutorEmail.toLowerCase().trim();

    // Verify student purchased the course
    const student = await User.findOne({ email: normalizedStudentEmail });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const hasPurchased = student.purchasedCourses.some(
      (course) => course.tutorEmail?.toLowerCase().trim() === normalizedTutorEmail && course.courseId === courseId
    );

    if (!hasPurchased) {
      return res.status(403).json({ error: "❌ You can only rate tutors whose courses you've purchased" });
    }

    // Check if rating already exists
    let ratingDoc = await Rating.findOne({
      studentEmail: normalizedStudentEmail,
      tutorEmail: normalizedTutorEmail,
      courseId
    });

    if (ratingDoc) {
      // Update existing rating
      ratingDoc.rating = rating;
      ratingDoc.review = review || "";
      ratingDoc.updatedAt = new Date();
      await ratingDoc.save();
      return res.json({ message: "Rating updated successfully", rating: ratingDoc });
    } else {
      // Create new rating
      ratingDoc = new Rating({
        tutorEmail: normalizedTutorEmail,
        tutorName,
        studentEmail: normalizedStudentEmail,
        studentName,
        courseId,
        courseName,
        rating,
        review: review || ""
      });
      await ratingDoc.save();
      return res.json({ message: "Rating submitted successfully", rating: ratingDoc });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL RATINGS FOR A TUTOR (all courses combined - kept for compatibility)
router.get("/tutor/:tutorEmail", async (req, res) => {
  try {
    const { tutorEmail } = req.params;

    const ratings = await Rating.find({ tutorEmail });

    if (ratings.length === 0) {
      return res.json({ ratings: [], averageRating: 0, totalRatings: 0 });
    }

    // Calculate average rating
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = (sum / ratings.length).toFixed(1);

    res.json({
      ratings,
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET RATINGS FOR A SPECIFIC COURSE (per-course average)
router.get("/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    const ratings = await Rating.find({ courseId });

    if (ratings.length === 0) {
      return res.json({ ratings: [], averageRating: 0, totalRatings: 0 });
    }

    // Calculate average rating for this specific course
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = (sum / ratings.length).toFixed(1);

    res.json({
      ratings,
      averageRating: parseFloat(averageRating),
      totalRatings: ratings.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET STUDENT'S RATING FOR A SPECIFIC COURSE
router.get("/student/:studentEmail/tutor/:tutorEmail/course/:courseId", async (req, res) => {
  try {
    const { studentEmail, tutorEmail, courseId } = req.params;

    const rating = await Rating.findOne({
      studentEmail,
      tutorEmail,
      courseId
    });

    if (!rating) {
      return res.json({ rating: null, message: "No rating found" });
    }

    res.json({ rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE RATING
router.delete("/delete/:ratingId", async (req, res) => {
  try {
    const { ratingId } = req.params;

    await Rating.findByIdAndDelete(ratingId);
    res.json({ message: "Rating deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
