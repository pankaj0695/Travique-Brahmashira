const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const PastTrip = require("./models/PastTrip");

// Import route files
const userAuthRoutes = require("./routes/Userauth");
const tripRoutes = require("./routes/tripRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS setup for Vercel frontend
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Use route files
app.use("/api/auth", userAuthRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/images", imageRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root route for Render health check
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

console.log(
  "Loaded OpenRouter API Key:",
  process.env.OPENROUTER_API_KEY ? "YES" : "NO"
);
console.log(
  "Using OpenRouter API Key:",
  process.env.OPENROUTER_API_KEY?.slice(0, 8)
);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
