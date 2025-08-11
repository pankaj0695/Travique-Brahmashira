const express = require("express");
const authRouter = express.Router();
const { register, login } = require("../controllers/userAuthentication");
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
// Register
// Log in
// Log out
// Get Profile
authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.post('/logout', userMiddleware, logout);
// authRouter.post('/admin/register', adminMiddleware,adminRegister);
// authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
// authRouter.get('/getProfile',getProfile);

module.exports = authRouter;
