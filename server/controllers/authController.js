const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

/** Generate JWT Access Token */
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

/** Generate JWT Refresh Token */
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

/** User Registration */
exports.registerUser = async (req, res) => {
  try {
    // Validate input
    await body("email").isEmail().run(req);
    await body("password").isLength({ min: 6 }).run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

/** User Login */

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("🔍 Login request received:", email);

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.error("❌ User not found");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("❌ Password mismatch");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("🔑 Password matched, generating token");

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // ✅ Extend token expiration to 1 hour
    );
    
    console.log("✅ Token generated successfully");

    res.json({ accessToken });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

/** Refresh Access Token */
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    const user = await User.findOne({ where: { refreshToken } });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      // Generate new access token
      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: "Error refreshing token", error });
  }
};

/** User Logout */
exports.logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;

    // Remove refresh token from database
    await User.update({ refreshToken: null }, { where: { id: userId } });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out", error });
  }
};
