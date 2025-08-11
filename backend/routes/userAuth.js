const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
} = require("../controllers/userAuthentication");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Register
authRouter.post("/register", register);

// Log in
authRouter.post("/login", login);

// Log out
authRouter.post("/logout", logout);

// Get Profile
authRouter.get("/profile", userMiddleware, getProfile);

// Commented out routes for future use
// authRouter.post('/admin/register', adminMiddleware, adminRegister);
// authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

module.exports = authRouter;
