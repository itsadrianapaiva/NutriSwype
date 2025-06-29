import mongoose from "mongoose";
import {
  getMe,
  updateProfile,
  getDashboard,
} from "../controllers/userController.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV } from "../config/env.js";

const mockRequest = (body = {}, user = null) => ({ body, user });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe("User Controller", () => {
  let userId, token;

  beforeEach(async () => {
    await User.deleteMany({});
    const user = await User.create({
      email: "test@test.com",
      password: "123456",
      name: "Test",
    });
    userId = user._id;
    token = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  });

  describe("getMe", () => {
    it("should return user data", async () => {
      const req = mockRequest({}, { id: userId });
      const res = mockResponse();

      await getMe(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: expect.objectContaining({
            email: "test@test.com",
            name: "Test",
          }),
        })
      );
    });
  });

  describe("updateProfile", () => {
    it("should update user profile", async () => {
      const req = mockRequest(
        {
          name: "Updated Test",
          profile: {
            dietaryRestrictions: ["vegan"],
            nutritionalGoals: {
              dailyCalories: 1800,
              proteinPercentage: 30,
              carbPercentage: 40,
              fatPercentage: 30,
            },
          },
        },
        { id: userId }
      );
      const res = mockResponse();

      await updateProfile(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Profile updated successfully",
          user: expect.objectContaining({
            name: "Updated Test",
            profile: expect.objectContaining({
              dietaryRestrictions: ["vegan"],
              nutritionalGoals: expect.objectContaining({
                dailyCalories: 1800,
              }),
            }),
          }),
        })
      );

      const user = await User.findById(userId);
      expect(user.name).toBe("Updated Test");
      expect(user.profile.dietaryRestrictions).toContain("vegan");
    });
  });

  describe("getDashboard", () => {
    it("should return user dashboard data", async () => {
      const req = mockRequest({}, { id: userId });
      const res = mockResponse();

      await getDashboard(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          dashboard: expect.objectContaining({
            user: expect.objectContaining({
              email: "test@test.com",
              name: "Test",
            }),
            stats: expect.objectContaining({
              profileCompletion: expect.any(Number),
            }),
          }),
        })
      );
    });
  });
});
