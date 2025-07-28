// Handle swipe creation logic

import Swipe from "../models/Swipe.js";

//Create a swipe if it does not already exist
export const createSwipeForUser = async ({ userId, mealId, action }) => {
  const existing = await Swipe.findOne({ user: userId, meal: mealId });
  if (existing) {
    throw Object.assign(new Error("Swipe already exists for this meal"), {
      statusCode: 400,
    });
  }

  const swipe = await Swipe.create({
    user: userId,
    meal: mealId,
    action,
  });

  return {
    id: swipe._id.toString(),
    meal: swipe.meal.toString(),
    action: swipe.action,
  };
};

//Get all swipes for a user, including populated meal info
export const getSwipesForUser = async (userId) => {
  const swipes = await Swipe.find({ user: userId }).populate("meal");

  return swipes.map((swipe) => ({
    id: swipe._id.toString(),
    user: swipe.user.toString(),
    action: swipe.action,
    meal: {
      id: swipe.meal._id.toString(),
      name: swipe.meal.name,
      dietaryTags: swipe.meal.dietaryTags,
    },
  }));
};
