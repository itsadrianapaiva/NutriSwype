import mongoose from "mongoose";
import { createSwipe, getUserSwipes } from "../controllers/swipeController";
import Swipe from "../models/Swipe.js";
import User from "../models/User.js";
import Meal from "../models/Meal.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const mockRequest = (body = {}, user = null) => ({
  body,
  user,
});
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};
const mockNext = jest.fn();

describe("Swipe Controller", () => {
  let userId, token, mealId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Swipe.deleteMany({});
    await Meal.deleteMany({});
    jest.clearAllMocks();

    const user = await User.create({
      email: "test@test.com",
      password: "123456",
      name: "Test",
    });
    userId = user._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const meal = await Meal.create({
      name: "Test Meal",
      dietaryTags: ["vegan"],
      ingredients: [{ name: "Test Ingredient", quantity: 100, unit: "g" }],
      nutrition: { calories: 300, protein: 20, carbs: 40, fat: 10 },
    });
    mealId = meal._id;
  });

  describe("createSwipe", () => {
    it("should create a new swipe", async () => {
      const req = mockRequest(
        { mealId: mealId.toString(), action: "like" },
        { id: userId.toString() }
      );
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await createSwipe(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Swipe recorded successfully",
          swipe: expect.objectContaining({
            id: expect.any(String),
            meal: mealId.toString(),
            action: "like",
          }),
        })
      );

      const swipe = await Swipe.findOne({
        user: userId,
        meal: mealId,
      });
      expect(swipe).toBeTruthy();
      expect(swipe.action).toBe("like");
    });

    it("should handle duplicate swipe", async () => {
      await Swipe.create({
        user: userId,
        meal: mealId,
        action: "like",
      });
      const req = mockRequest(
        { mealId: mealId.toString(), action: "dislike" },
        { id: userId }
      );
      const res = mockResponse();

      await createSwipe(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Swipe already exists for this meal",
        })
      );
    });
  });

  describe("getUserSwipes", () => {
    it("should return user swipes with populated meal data", async () => {
      const req = { user: { id: userId.toString() } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await Swipe.create({
        user: req.user.id,
        meal: mealId,
        action: "like",
      });

      await getUserSwipes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          swipes: expect.arrayContaining([
            expect.objectContaining({
                action: "like",
              user: req.user.id,
              meal: expect.objectContaining({
                name: "Test Meal",
                dietaryTags: expect.arrayContaining(["vegan"]),
              }),
            }),
          ]),
        })
      );
    });

    it("should return empty array if no swipes exist", async () => {
      const req = mockRequest({}, { id: userId.toString() });
      const res = mockResponse();

      await getUserSwipes(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          swipes: [],
        })
      );
    });
  });
});
