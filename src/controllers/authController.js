import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";
import {
  createUser,
  loginUser,
  generateToken,
  getCookieOptions,
} from "../services/authService.js";

// Register
// route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);

    const token = generateToken(user._id);
    res.cookie("jwt", token, getCookieOptions());

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message, error.stack);

    if (error.code === 11000 || error.message === "User already exists") {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    next(error);
  }
};

// Login
// route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);

    const token = generateToken(user._id);
    res.cookie("jwt", token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message, error.stack);
    next(error);
  }
};

// Logout
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

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message, error.stack);
    next(error);
  }
};
