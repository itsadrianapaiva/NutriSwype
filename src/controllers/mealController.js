import Meal from "../models/Meal.js";
import User from "../models/User.js";

export const createMeal = async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      ingredients,
      nutrition,
      dietaryTags,
      cuisineType,
      cookingTime,
      instructions,
    } = req.body;

    const meal = await Meal.create({
      name,
      description,
      image,
      ingredients,
      nutrition,
      dietaryTags,
      cuisineType,
      cookingTime,
      instructions,
    });

    res.status(201).json({
      success: true,
      message: "Meal created successfully",
      meal: {
        id: meal._id,
        name: meal.name,
        dietaryTags: meal.dietaryTags,
      },
    });
  } catch (error) {
    console.error("Meal creation error:", error.message, error.stack);
    next(error);
  }
};

export const getMeals = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    const dietaryRestrictions = user.profile?.dietaryRestrictions || [];

    const meals = await Meal.find({
      dietaryTags: { $all: dietaryRestrictions },
    }).limit(10); //limit for perfomance

    res.status(200).json({
      success: true,
      meals,
    });
  } catch (error) {
    console.error("Get meals error:", error.message, error.stack);
    next(error);
  }
};
