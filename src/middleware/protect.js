import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";

const protect = async (req, res, next) => {
  try {
    // Reads JWT from cookie
    console.log("Checking for token...");
    const token = req.cookies.jwt;
    if (!token) {
      console.log("No token found");
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided" });
    }

    // Verifies it with JWT_SECRET
    console.log("Verifying token...");
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Token verified, user ID:", decoded.id);

    // Finds user by ID in the token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. User not found" });
    }

    // Attaches user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

export default protect;
