import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { createMeal, getMeals } from "../controllers/mealController.js";
import User from "../models/User.js";
import Meal from "../models/Meal.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const mockRequest = (body = {}, user = null) => ({ body, user });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};
const mockNext = jest.fn();

describe("Meal Controller", () => {
  let userId, token;

  beforeEach(async () => {
    await User.deleteMany({});
    await Meal.deleteMany({});
    jest.clearAllMocks();

    const user = await User.create({
      email: "test@test.com",
      password: "123456",
      name: "Test",
      profile: {
        dietaryRestrictions: ["vegan", "gluten-free"],
      },
    });
    userId = user._id;
    token = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  });

  describe("createMeal", () => {
    it("should create a new meal successfully", async () => {
      const req = mockRequest({
        name: "Test Meal",
        description: "Test description",
        image: "https://example.com/image.jpg",
        ingredients: [
          { name: "Test Ingredient", quantity: 100, unit: "g" },
          { name: "Another Ingredient", quantity: 200, unit: "ml" },
        ],
        nutrition: { calories: 300, protein: 20, carbs: 40, fat: 10 },
        dietaryTags: ["vegan", "gluten-free"],
        cuisineType: "Indian",
        cookingTime: 30,
        instructions: ["Cook the meal", "Mix all", "Serve cold"],
      });

      const res = mockResponse();

      await createMeal(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Meal created successfully",
          meal: expect.objectContaining({
            name: "Test Meal",
            dietaryTags: expect.arrayContaining(["vegan", "gluten-free"]),
          }),
        })
      );

      const mealInDb = await Meal.findOne({ name: "Test Meal" });
      expect(mealInDb).toBeTruthy();
    });

    it("should fail to create meal without name", async () => {
      const req = mockRequest({
        description: "No name meal",
        ingredients: [{ name: "Ingredient", quantity: 100, unit: "g" }],
        nutrition: { calories: 200, protein: 10, carbs: 30, fat: 5 },
      });

      const res = mockResponse();

      await createMeal(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled(); //go to error handler
    });
  });

  describe("getMeals", () => {
    it("should return meals matching users dietary restrictions", async () => {
      await Meal.create([
        {
          name: "Test Meal",
          dietaryTags: ["vegan", "gluten-free"],
          ingredients: [{ name: "Ingredient", quantity: 100, unit: "g" }],
          nutrition: { calories: 200, protein: 10, carbs: 30, fat: 5 },
        },
        {
          name: "Another Meal",
          dietaryTags: ["vegetarian"],
          ingredients: [
            { name: "Another Ingredient", quantity: 150, unit: "g" },
          ],
          nutrition: { calories: 300, protein: 20, carbs: 40, fat: 10 },
        },
      ]);

      const req = { user: { id: userId.toString() } };
      const res = mockResponse();

      await getMeals(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          meals: expect.arrayContaining([
            expect.objectContaining({
              name: "Test Meal",
              dietaryTags: expect.arrayContaining(["vegan", "gluten-free"]),
            }),
          ]),
        })
      );
    });

    it("should return empty array if no meals match", async () => {
      const user = await User.create({
        email: "nomatch@test.com",
        password: "123456",
        profile: {
          dietaryRestrictions: ["paleo", "keto"],
        },
      });

      const req = { user: { id: user._id } };
      const res = mockResponse();

      await getMeals(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          meals: [],
        })
      );
    });

    it("should handle error when user not found", async () => {
      const req = { user: { id: new mongoose.Types.ObjectId() } };
      const res = mockResponse();

      await getMeals(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
