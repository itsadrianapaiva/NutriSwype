// Separate service for authentication-related logic

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";

//Generate a signed JWT for a given user ID
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

//Return common secure cookie options
export const getCookieOptions = () => ({
  httpOnly: true,
  secure: NODE_ENV === "production", // Use secure cookies in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: NODE_ENV === "production" ? "Strict" : "None",
});

//Create a new user and return sanitized object
export const createUser = async ({ email, password, name }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw Object.assign(new Error("User already exists"), {
      statusCode: 400,
    });
  }

  const user = await User.create({ email, password, name });
  if (!user) {
    throw Object.assign(new Error("User creation failed"), {
      statusCode: 400,
    });
  }

  return user;
};

//Authenticate user by email and password
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }
  return user;
};
