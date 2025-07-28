import {
  createSwipeForUser,
  getSwipesForUser,
} from "../services/swipeService.js";

//POST /api/swipes
export const createSwipe = async (req, res, next) => {
  try {
    const payload = await createSwipeForUser({
      userId: req.user.id,
      mealId: req.body.mealId,
      action: req.body.action,
    });

    res.status(201).json({
      success: true,
      message: "Swipe recorded successfully",
      swipe: payload,
    });
  } catch (error) {
    console.error("Swipe creation error:", error.message, error.stack);
    next(error);
  }
};

//GET /api/swipes/my-swipes
export const getUserSwipes = async (req, res, next) => {
  try {
    const swipes = await getSwipesForUser(req.user.id);

    res.status(200).json({
      success: true,
      swipes,
    });
  } catch (error) {
    console.error("Get swipes error:", error.message, error.stack);
    next(error);
  }
};
