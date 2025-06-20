import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

connectDB();

//Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", //frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Increase limit for larger payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

//Health check endpoint
app.get("/health", (req, res) => {
  console.log("Health check request received");
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "nutriswype-backend",
  });
});

//API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    path: req.originalUrl,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

export default app;
