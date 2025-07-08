import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";

const createToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Register new user
// route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    //Create and save user
    const user = await User.create({ email, password, name });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User creation failed" });
    }

    // JWT creation
    const token = createToken(user._id);

    // Set cookie (secure, HTTP-only)
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict", // CSRF protection
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Registration error:", error.message, error.stack);
    if (error.code === 11000) {
      console.log("Duplicate key error:", email);
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
};

// Login user
// route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user and match password
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({success: false, message: "Invalid email or password" });
    }

    const token = createToken(user._id);

    //Set cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: NODE_ENV === "production", // Use secure cookies in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "None", // allow cross-site requests
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        token: token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    next(error);
  }
};

// Logout user
// route POST /api/auth/logout
export const logout = (req, res, next) => {
  try {
    // Clear cookie
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      maxAge: 0,
      sameSite: "Strict",
    });

    res.status(200).json({success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message, error.stack);
    next(error);
  }
};
