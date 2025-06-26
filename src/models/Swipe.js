import mongoose from "mongoose";

const swipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    action: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { key: { user: 1, meal: 1 }, unique: true }, // Ensure one swipe per user-meal pair
    ],
  }
);

export default mongoose.model("Swipe", swipeSchema);
