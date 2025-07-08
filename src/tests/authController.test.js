import mongoose from "mongoose";
import { register, login, logout } from "../controllers/authController.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Mock request and response
const mockRequest = (body = {}, user = null) => ({ body, user });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};
const mockNext = jest.fn();

describe("Auth Controller", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const req = mockRequest({
        email: "test@test.com",
        password: "123456",
        name: "Test",
      });
      const res = mockResponse();

      await register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "User registered successfully",
          user: expect.objectContaining({
            email: "test@test.com",
            name: "Test",
          }),
        })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "jwt",
        expect.any(String),
        expect.any(Object)
      );

      const user = await User.findOne({ email: "test@test.com" });
      expect(user).toBeTruthy();
    });

    it("should handle duplicate email", async () => {
      await User.create({
        email: "test@test.com",
        password: "123456",
        name: "Test",
      });
      const req = mockRequest({
        email: "test@test.com",
        password: "123456",
        name: "Test",
      });
      const res = mockResponse();

      await register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "User already exists",
        })
      );
    });
  });

  describe("login", () => {
    it("should login with valid credentials", async () => {
      const user = await User.create({
        email: "test@test.com",
        password: "123456",
        name: "Test",
      });
      const req = mockRequest({ email: "test@test.com", password: "123456" });
      const res = mockResponse();

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Login successful",
          user: expect.objectContaining({
            email: "test@test.com",
            name: "Test",
            token: expect.any(String),
          }),
        })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "jwt",
        expect.any(String),
        expect.any(Object)
      );
    });

    it("should reject invalid credentials", async () => {
      await User.create({
        email: "test@test.com",
        password: "123456",
        name: "Test",
      });
      const req = mockRequest({
        email: "test@test.com",
        password: "wrong-password",
      });
      const res = mockResponse();

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid email or password",
        })
      );
    });
  });

  describe("logout", () => {
    it("should clear JWT cookie and return success", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await logout(req, res, mockNext);

      expect(res.cookie).toHaveBeenCalledWith(
        "jwt",
        "",
        expect.objectContaining({ maxAge: 0 })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Logout successful",
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
