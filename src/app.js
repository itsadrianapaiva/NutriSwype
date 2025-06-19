import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

//Middleware
app.use(
  cors({
    origin: "http://localhost:3000", //frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(express.json());
app.use(cookieParser());

//App routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

//Test route
app.get("/api/ping", (req, res) => {
  res.json({ message: "API working" });
});

export default app;
