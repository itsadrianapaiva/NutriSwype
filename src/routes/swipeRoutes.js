import express from "express";
import protect from "../middleware/protect.js";
import { validate } from "../middleware/validate.js";
import { createSwipe, getUserSwipes } from "../controllers/swipeController.js";

const router = express.Router();

// POST /api/swipes
router.post("/", protect, validate("swipe"), createSwipe);

// GET /api/swipes/my-swipes
router.get("/my-swipes", protect, getUserSwipes);

export default router;
