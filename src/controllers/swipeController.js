import Swipe from "../models/Swipe.js";

export const createSwipe = async (req, res, next) => {
  try {
    const { mealId, action } = req.body;

    const existingSwipe = await Swipe.findOne({
      user: req.user.id,
      meal: mealId,
    });

    if (existingSwipe) {
      return res.status(400).json({
        success: false,
        message: "Swipe already exists for this meal",
      });
    }

    const swipe = await Swipe.create({
      user: req.user.id,
      meal: req.body.mealId,
      action: action,
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
    next(error);
  }
};

export const getUserSwipes = async (req, res, next) => {
  try {
    const swipes = await Swipe.find({
      user: req.user.id,
    }).populate("meal");

    const payload = swipes.map((swipe) => ({
      id: swipe._id.toString(),
      user: swipe.user.toString(),
      action: swipe.action,
      meal: {
        id: swipe.meal._id.toString(),
        name: swipe.meal.name,
        dietaryTags: swipe.meal.dietaryTags,
      },
    }));

    res.status(200).json({
      success: true,
      swipes: payload,
    });
  } catch (error) {
    console.error("Get swipes error:", error.message, error.stack);
    next(error);
  }
};
