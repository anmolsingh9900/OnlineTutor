const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");


// 🔐 REGISTER
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Normalize email
    const normalizedEmail = (email || "").toLowerCase().trim();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      ...req.body,
      email: normalizedEmail,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔐 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Normalize email for comparison
    const normalizedEmail = (email || "").toLowerCase().trim();

    const user = await User.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: "i" } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Return normalized email
    res.json({
      message: "Login successful",
      role: user.role,
      name: user.name,
      email: (user.email || "").toLowerCase().trim()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔍 GET USER BY EMAIL AT LOGIN
router.post("/get-user", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Normalize email
    const normalizedEmail = (email || "").toLowerCase().trim();

    const user = await User.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: "i" } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET tutors
router.get("/tutors", async (req, res) => {
  const tutors = await User.find({ role: "tutor" });
  res.json(tutors);
});

// 👤 GET FULL PROFILE (for MyProfile page)
router.get("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    // Normalize email
    const normalizedEmail = (email || "").toLowerCase().trim();

    const user = await User.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: "i" } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      dob: user.dob
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ UPDATE PROFILE
router.put("/profile/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { name, mobile, gender, dob, password } = req.body;
    
    // Normalize email
    const normalizedEmail = (email || "").toLowerCase().trim();

    const updateData = {
      name,
      mobile,
      gender,
      dob
    };

    // ✅ If password is being updated
    if (password && password.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: { $regex: `^${normalizedEmail}$`, $options: "i" } },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        role: updatedUser.role,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        gender: updatedUser.gender,
        dob: updatedUser.dob
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🛒 ADD COURSE TO PURCHASES
router.post("/purchase", async (req, res) => {
  try {
    const { email, courseId, courseName, tutorName, tutorEmail, fee } = req.body;
    
    // Normalize email
    const normalizedEmail = (email || "").toLowerCase().trim();

    const user = await User.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: "i" } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already purchased
    const alreadyPurchased = user.purchasedCourses.some(p => p.courseId === courseId);
    if (alreadyPurchased) {
      return res.status(400).json({ message: "Course already purchased" });
    }

    // Add to purchased courses
    user.purchasedCourses.push({
      courseId,
      courseName,
      tutorName,
      tutorEmail,
      fee,
      purchaseDate: new Date()
    });

    await user.save();

    res.json({
      message: "Course purchased successfully",
      purchasedCourses: user.purchasedCourses
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📚 GET PURCHASED COURSES FOR STUDENT
router.get("/purchases/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    // Normalize email
    const normalizedEmail = (email || "").toLowerCase().trim();

    const user = await User.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: "i" } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      purchasedCourses: user.purchasedCourses || []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;