import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import swipeRoutes from "./routes/swipeRoutes.js";

const app = express();

// connectDB();

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
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/meals", mealRoutes);
// app.use("/api/swipes", swipeRoutes);
console.log('Mounting routes...');
try {
  console.log('Registering /api/auth routes:', authRoutes.stack.map(r => r.route ? r.route.path : 'middleware'));
  app.use('/api/auth', authRoutes);
  console.log('Mounted /api/auth');
  console.log('Registering /api/users routes:', userRoutes.stack.map(r => r.route ? r.route.path : 'middleware'));
  app.use('/api/users', userRoutes);
  console.log('Mounted /api/users');
  console.log('Registering /api/swipes routes:', swipeRoutes.stack.map(r => r.route ? r.route.path : 'middleware'));
  app.use('/api/swipes', swipeRoutes);
  console.log('Mounted /api/swipes');
  console.log('Registering /api/meals routes:', mealRoutes.stack.map(r => r.route ? r.route.path : 'middleware'));
  app.use('/api/meals', mealRoutes);
  console.log('Mounted /api/meals');
} catch (err) {
  console.error('Route mounting error:', err.message, err.stack);
  process.exit(1);
}

// // 404 handler
console.log('Mounting 404 handler...');
app.use((req, res) => {
  console.log('404 handler hit for:', req.originalUrl)
  res.status(404).json({
    path: req.originalUrl,
    message: 'Route not found'
  })
})
console.log('Mounted 404 handler')


// Global error handler
app.use(errorHandler);

// Connect to database
console.log('Starting database connection...');
connectDB()
  .catch((err) => {
    console.error('Database connection failed:', err.message, err.stack);
    process.exit(1);
  });

export default app;
