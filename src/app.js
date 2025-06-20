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
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "nutriswype-backend",
  });
});

//API routes
console.log("Mounting routes...");
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// // 404 handler
// console.log('Mounting 404 handler...');
// try {
//   app.use('*', (req, res) => {
//     console.log('404 handler hit for:', req.originalUrl);
//     res.status(404).json({
//       path: req.originalUrl,
//       message: 'Route not found',
//     });
//   });
//   console.log('Mounted 404 handler');
// } catch (err) {
//   console.error('404 handler mounting error:', err.message, err.stack);
//   process.exit(1);
// }

// Global error handler
app.use(errorHandler);

export default app;
