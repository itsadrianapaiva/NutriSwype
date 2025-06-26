import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Meal name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, //URL or file path
      trim: true,
    },
    ingredients: [
      {
        name: { type: String, required: true, trim: true },
        quantity: {
          type: Number,
          required: true,
          min: [0, "Quantity cannot be negative"],
        },
        unit: { type: String, trim: true }, // e.g., g, ml
      },
    ],
    nutrition: {
      calories: {
        type: Number,
        required: true,
        min: [0, "Calories cannot be negative"],
      },
      protein: {
        type: Number,
        required: true,
        min: [0, "Protein cannot be negative"],
      },
      carbs: {
        type: Number,
        required: true,
        min: [0, "Carbs cannot be negative"],
      },
      fats: {
        type: Number,
        required: true,
        min: [0, "Fats cannot be negative"],
      },
    },
    dietaryTags: {
      type: [String],
      enum: [
        "vegan",
        "vegetarian",
        "gluten-free",
        "dairy-free",
        "nut-free",
        "low-carb",
        "high-protein",
      ],
      default: [],
    },
    cuisineType: {
      type: String,
      trim: true, // e.g., Italian, Mexican
    },
    cookingTime: {
      type: Number, // in minutes
      min: [0, "Cooking time cannot be negative"],
    },
    instructions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Meal", mealSchema);
