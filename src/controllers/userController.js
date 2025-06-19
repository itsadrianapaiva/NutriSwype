import User from "../models/User.js";

// GET /api/users/me
export const getMe = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { profile: { ...req.user.profile, ...updates } } },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    req.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// GET /api/users/dashboard
export const getDashboard = async (req, res) => {
  try {
    const user = req.user;

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
      data: {
        user: {
          email: user.email,
          profile: user.profile,
        },
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
    });
  }
};

// Helper function to calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  let completed = 0;
  const total = 4; // Total number of profile fields to check

  if (user.profile.dietaryRestrictions?.length > 0) completed++;
  if (user.profile.nutritionGoals?.dailyCalories > 0) completed++;
  if (user.profile.preferences?.cuisineTypes?.size > 0) completed++;
  if (user.profile.confidenceScores?.cuisineTypes > 0) completed++;

  return Math.round((completed / total) * 100);
};
