import Joi from "joi";

//Joi schemas for simple validation
const registerSchema = Joi.object({
  name: Joi.string().min(1).max(50).default("Anonymous"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
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

const swipeSchema = Joi.object({
  mealId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid meal ID",
    "string.length": "Invalid meal ID length",
  }),
  action: Joi.string().valid("like", "dislike").required().messages({
    "any.only": 'Action must be either "like" or "dislike"',
  }),
});

const createMealSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    "string.empty": "Meal name is required",
  }),
  description: Joi.string().optional().allow(""),
  image: Joi.string().uri().optional().allow(""),
  ingredients: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).required().messages({
          "string.empty": "Ingredient name is required",
        }),
        quantity: Joi.number().min(0).required().messages({
          "number.min": "Ingredients quantity must be non-negative",
        }),
        unit: Joi.string().optional().allow(""),
      })
    )
    .optional(),
  nutrition: Joi.object({
    calories: Joi.number().min(0).required().messages({
      "number.min": "Calories must non-negative",
    }),
    protein: Joi.number().min(0).required().optional(),
    carbs: Joi.number().min(0).required().optional(),
    fat: Joi.number().min(0).required().optional(),
  }).required(),
  dietaryTags: Joi.array()
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
  cuisineType: Joi.string().optional().allow(""),
  cookingTime: Joi.number().min(0).optional().messages({
    "number.min": "Cooking time cannot be negative",
  }),
  instructions: Joi.array().items(Joi.string().optional()),
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
      swipe: swipeSchema,
      createMeal: createMealSchema,
    }[type] || registerSchema;
  const { error, value } = schema.validate(data, { abortEarly: false });
  const errors = error ? error.details.map((err) => err.message) : [];

  // Custom validation for nutritionalGoals (if present)
  if (["updateProfile"].includes(type) && data.profile?.nutritionalGoals) {
    errors.push(...validateNutritionPercentages(data.profile.nutritionalGoals));
  }

  return { errors, value };
};
