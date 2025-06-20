import express from "express";
import protect from "../middleware/protect.js";
import { getMe, updateProfile, getDashboard } from "../controllers/userController.js"
import { validate } from "../middleware/validate.js";

const router = express.Router();

// All routes are protected
router.use(protect);

//GET /api/users/me - Get current user profile
router.get("/me", getMe);

// PATCH /api/users/me - Update current user profile
router.patch("/profile", validate('updateProfile'), updateProfile);

// GET /api/users/dashboard - Get user dashboard data
router.get("/dashboard", getDashboard);

export default router;
