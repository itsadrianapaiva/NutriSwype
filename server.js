import dotenv from "dotenv";
import app from "./src/app.js";
import { NODE_ENV } from "./src/config/env.js";

//Load environment variables
dotenv.config();

// Get PORT from environment or default
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`NutriSype is running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}` || "development");
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
