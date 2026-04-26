const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

// 🔍 LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ✅ FIXED STATIC PATH
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/chats", require("./routes/chatRoutes"));
const ratingRoutes = require("./routes/ratingRoutes");
app.use("/api/ratings", ratingRoutes);

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/online_tutor")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});