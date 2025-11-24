// backend/controllers/userController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccessToken } = require("../utils/generateToken"); // we'll add this
const { generateRefreshToken } = require("../utils/generateRefreshToken");

// helper to send refresh token as httpOnly cookie
const sendRefreshToken = (res, token) => {
  // cookie options: secure should be true in production (HTTPS)
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on prod (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  };
  res.cookie("refreshToken", token, cookieOptions);
};

// Signup
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password });
    await user.save();

    // create tokens
    const accessToken = generateAccessToken(user._id, process.env.JWT_SECRET);
    const refreshToken = generateRefreshToken(user._id, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    
    // Set access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    // Set refresh token cookie
    sendRefreshToken(res, refreshToken);


    res.status(201).json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // create tokens
    const accessToken = generateAccessToken(user._id, process.env.JWT_SECRET);
    const refreshToken = generateRefreshToken(user._id, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000
    });

    sendRefreshToken(res, refreshToken);

    res.json({
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh access token
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token, please login" });

    let payload;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token, please login again" });
    }

    // Optionally: verify the user still exists / is active
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = generateAccessToken(user._id, process.env.JWT_SECRET);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout — clears the refresh cookie
exports.logoutUser = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
  });
  res.json({ message: "Logged out" });
};

// Get Profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};