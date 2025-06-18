import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register new user
// route POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Create and save user
    const user = await User.create({ email, password, name });

    // JWT creation
    const token = createToken(user._id);

    // Set cookie (secure, HTTP-only)
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict", // CSRF protection
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
// route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const token = createToken(user._id);

    //Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict", // CSRF protection
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};
