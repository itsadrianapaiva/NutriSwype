import User from "../models/User.js";

// GET /api/users/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile || {},
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error.message, error.stack);
    next(error);
  }
};

// PATCH /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, profile } = req.body;
    const updateData = { name, profile };

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, profile },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile || {},
      }
    });
  } catch (error) {
    console.error("Profile update error:", error.message, error.stack);
    next(error);
  }
};

// GET /api/users/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate profile completion percentage
    const profileCompletion = calculateProfileCompletion(user);

    // Get basic stats (we'll expand this later)
    const stats = {
      profileCompletion,
      totalSwipes: 0, //will be calculated from swipes completion later
      mealPlansGenerated: 0, //will be calculated later
      favoriteCount: 0, //will be calculated later
    };

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dietaryRestrictions: user.profile?.dietaryRestrictions || [],
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Dashboard retrieval error:", error.message, error.stack);
    next(error);
  }
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  let completed = 0;
  const total = 3; // Total number of profile fields to check

  if (user.name && user.name !== "Anonymous") completed++;
  if (user.profile.dietaryRestrictions?.length > 0) completed++;
  if (user.profile.nutritionGoals?.dailyCalories !== 2000) completed++;

  return Math.round((completed / total) * 100);
};
