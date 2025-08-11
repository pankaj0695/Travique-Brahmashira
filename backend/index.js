// Load environment variables before anything else
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");

// Import route files
const userAuthRoutes = require("./routes/userAuth"); // contains OTP routes
const tripRoutes = require("./routes/tripRoutes");
const adminAuthRoutes = require("./routes/adminAuth");
const imageRoutes = require("./routes/imageRoutes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// ===== Middleware =====
// CORS setup for frontend
const corsOptions = {
  origin: ["http://localhost:5174", "http://localhost:5173"], // Add your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Use route files
app.use("/api/auth", userAuthRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/locations", locationRoutes);

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Health Check Routes =====
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    "Loaded OpenRouter API Key:",
    process.env.OPENROUTER_API_KEY ? "YES" : "NO"
  );
  console.log(
    "Using OpenRouter API Key:",
    process.env.OPENROUTER_API_KEY?.slice(0, 8)
  );
});
