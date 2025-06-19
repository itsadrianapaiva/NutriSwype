import express from "express";
import protect from "../middleware/protect.js";
import { getMe, updateProfile, getDashboardData } from "../controllers/userController.js"
import { validateFunction } from "../middleware/validate.js";

const router = express.Router();

// All routes are protected
router.use(protect);

//GET /api/users/me - Get current user profile
router.get("/me", getMe);

// PUT /api/users/me - Update current user profile
router.put("/profile", validateFunction, updateProfile);

// GET /api/users/dashboard - Get user dashboard data
router.get("/dashboard", getDashboardData);

export default router;
