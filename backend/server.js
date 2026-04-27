require("dotenv").config(); // ✅ load env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ CORS (use env in production)
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : "*";
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔍 LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`   Body:`, req.body);
  }
  next();
});

// ✅ STATIC PATH
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🧪 TEST: Check database (must be BEFORE route middlewares)
app.get("/api/test/tutors", async (req, res) => {
  res.json({ message: "Test endpoint works!" });
});

// ✅ Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/chats", require("./routes/chatRoutes"));
app.use("/api/ratings", require("./routes/ratingRoutes"));

// ✅ MongoDB Connection (Improved)
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ MONGODB_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(mongoUri)
.then(() => {
  const isProd = process.env.NODE_ENV === "production";
  console.log(isProd ? "☁️ Connected to MongoDB Atlas (Production)" : "🏠 Connected to MongoDB Atlas (Local Development)");
})
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// ✅ Test route
app.get("/", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.send(`Backend working ${isProd ? "on Production 🚀" : "Locally 🏠"}`);
});


// 🚨 ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🚨 GLOBAL ERROR:", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    files: req.files,
  });
  res.status(500).json({ error: err.message });
});

// ✅ 404 handler
app.use((req, res) => {
  console.warn(`⚠️ 404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ error: "Route not found" });
});

// ✅ Port
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  const isProd = process.env.NODE_ENV === "production";
  console.log(`🚀 Server running on port ${PORT} [${isProd ? "PRODUCTION" : "LOCAL"}]`);
});