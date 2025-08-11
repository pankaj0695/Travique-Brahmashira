const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin Register
router.post("/register", async (req, res) => {
  try {
    const { name, emailId, password } = req.body;
    if (!name || !emailId || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const existingAdmin = await User.findOne({ emailId, role: "admin" });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      name,
      emailId,
      password: hashedPassword,
      role: "admin",
    });
    await admin.save();
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      message: "Admin registered successfully.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        emailId: admin.emailId,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// Admin Login
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const admin = await User.findOne({
      emailId,
      role: { $in: ["admin", "superadmin"] },
    });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Admin logged in successfully.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        emailId: admin.emailId,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// Get all users
router.get("/users", verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// Get all admins
router.get("/admins", verifyAdminToken, async (req, res) => {
  try {
    const admins = await User.find({
      role: { $in: ["admin", "superadmin"] },
    }).select("-password");
    res.status(200).json({ admins });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
