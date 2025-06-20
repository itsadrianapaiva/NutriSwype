import Joi from "joi";

//Joi schemas for simple validation
const registerSchema = Joi.object({
  name: Joi.string().min(1).max(50).default("Anonymous"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  profile: Joi.object({
    dietaryRestrictions: Joi.array()
      .items(
        Joi.string().valid(
          "gluten-free",
          "dairy-free",
          "nut-free",
          "vegan",
          "vegetarian",
          "paleo",
          "keto"
        )
      )
      .default([]),
    nutritionGoals: Joi.object({
      dailyCalories: Joi.number().min(1000).max(5000).default(2000),
      proteinPercentage: Joi.number().min(10).max(50).default(25),
      carbPercentage: Joi.number().min(20).max(50).default(25),
      fatPercentage: Joi.number().min(10).max(50).default(25),
    }).default(),
    preferences: Joi.object({
      cuisineTypes: Joi.object()
        .pattern(Joi.string(), Joi.number())
        .default({}),
      ingredients: Joi.object().pattern(Joi.string(), Joi.number()).default({}),
    }).default(),
  }).default(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(1).max(50).optional(),
  profile: Joi.object({
    dietaryRestrictions: Joi.array()
      .items(
        Joi.string().valid(
          "gluten-free",
          "dairy-free",
          "nut-free",
          "vegan",
          "vegetarian",
          "paleo",
          "keto"
        )
      )
      .optional(),
    nutritionGoals: Joi.object({
      dailyCalories: Joi.number().min(1000).max(5000).optional(),
      proteinPercentage: Joi.number().min(10).max(50).optional(),
      carbPercentage: Joi.number().min(20).max(50).optional(),
      fatPercentage: Joi.number().min(10).max(50).optional(),
    }).optional(),
    preferences: Joi.object({
      cuisineTypes: Joi.object().pattern(Joi.string(), Joi.number()).optional(),
      ingredients: Joi.object().pattern(Joi.string(), Joi.number()).optional(),
    }).optional(),
  }).optional(),
});

// Custom validation for nutrition percentages
const validateNutritionPercentages = (nutritionGoals) => {
  if (!nutritionGoals) return [];
  const { proteinPercentage, carbPercentage, fatPercentage } = nutritionGoals;

  const total =
    (proteinPercentage || 0) + (carbPercentage || 0) + (fatPercentage || 0);

  if (total > Math.abs(total - 100) > 1) {
    return ["Nutritional percentages must sum to 100 (±1%)"];
  }
  return [];
};

//Main validation function
export const validateUser = (data, type = "register") => {
  const schema =
    {
      register: registerSchema,
      login: loginSchema,
      updateProfile: updateProfileSchema,
    }[type] || registerSchema;
  const { error, value } = schema.validate(data, { abortEarly: false });
  const errors = error ? error.details.map((err) => err.message) : [];

  // Custom validation for nutritionalGoals (if present)
  if (
    ["register", "updateProfile"].includes(type) &&
    data.profile?.nutritionalGoals
  ) {
    errors.push(...validateNutritionPercentages(data.profile.nutritionalGoals));
  }

  return { errors, value };
};
