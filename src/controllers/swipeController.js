import Swipe from "../models/Swipe.js";

export const createSwipe = async (req, res, next) => {
  try {
    const { mealId, action } = req.body;

    const swipe = await Swipe.create({
      user: req.user.id,
      meal: req.body.mealId,
      action: req.body.action,
    });
    res.status(201).json({
      success: true,
      message: "Swipe recorded successfully",
      swipe: {
        id: swipe._id.toString(),
        meal: swipe.meal.toString(),
        action: swipe.action,
      },
    });
  } catch (error) {
    console.error("Swipe creation error:", error.message, error.stack);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Swipe already exists for this meal",
      });
    }
    next(error);
  }
};

export const getUserSwipes = async (req, res, next) => {
  try {
    const swipes = await Swipe.find({
      user: req.user.id,
    }).populate("meal");

    res.status(200).json({
      success: true,
      swipes,
    });
  } catch (error) {
    console.error("Get swipes error:", error.message, error.stack);
    next(error);
  }
};
