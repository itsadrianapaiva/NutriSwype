import express from "express";
import protect from "../middleware/protect.js";
import { validate } from "../middleware/validate.js";
import { createMeal, getMeals } from "../controllers/mealController.js";

const router = express.Router();

// POST /api/meals
router.post("/", protect, validate("createMeal"), createMeal);

// GET /api/meals
router.get("/", protect, getMeals);

export default router;