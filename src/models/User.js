import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Anonymous",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    profile: {
      dietaryRestrictions: {
        type: [String],
        enum: [
          "gluten-free",
          "dairy-free",
          "nut-free",
          "vegan",
          "vegetarian",
          "paleo",
          "keto",
        ],
        default: [],
      },
      nutritionGoals: {
        dailyCalories: {
          type: Number,
          min: [1000, "Calories must be at least 1000"],
          max: [5000, "Calories cannot exceed 5000"],
          default: 2000,
        },
        proteinPercentage: {
          type: Number,
          min: [10, "Protein must be at least 10%"],
          max: 50,
          default: 25,
        },
        carbPercentage: {
          type: Number,
          min: [20, "Carbs must be at least 20%"],
          max: 70,
          default: 45,
        },
        fatPercentage: {
          type: Number,
          min: [10, "Fat must be at least 10%"],
          max: 50,
          default: 30,
        },
      },
      preferences: {
        cuisineTypes: {
          type: Map,
          of: Number,
          default: new Map(),
        },
        ingredients: {
          type: Map,
          of: Number,
          default: new Map(),
        },
        cookingMethods: {
          type: Map,
          of: Number,
          default: new Map(),
        },
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v; // Remove version key if present
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Validate nutritional percentages sum to 100
userSchema.pre("save", async function (next) {
  const { proteinPercentage, carbPercentage, fatPercentage } =
    this.profile.nutritionGoals;
  const total = proteinPercentage + carbPercentage + fatPercentage;

  if (Math.abs(total - 100) > 1) {
    //allow 1% for rounding
    return next(new Error("Nutritional percentages must sum to 100"));
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
