const User = require("../models/user");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    validate(req.body);
    const {
      name,
      emailId,
      password,
      image,
      phoneno,
      city,
      state,
      country,
      bio,
    } = req.body;
    req.body.password = await bcrypt.hash(password, 10);
    req.body.role = "user";
    // Create the user
    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
    // Remove password from user object before sending
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(201).send({
      message: "User Registered Successfully",
      user: userResponse,
      token: token,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId) throw new Error("Invalid Credentials");
    if (!password) throw new Error("Invalid Credentials");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid Credentials");

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error("Invalid Credentials");

    const token = jwt.sign(
      { _id: user._id, emailId: emailId },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );

    // Remove password from user object before sending
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.status(200).send({
      message: "Logged In Successfully",
      user: userResponse,
      token: token,
    });
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

const logout = async (req, res) => {
  try {
    // Since we're using localStorage, we don't need to clear anything on the server
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports = { register, login, logout, getProfile };
