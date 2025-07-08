import protect from "../middleware/protect.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

jest.mock("jsonwebtoken");
jest.mock("../models/User.js");

describe("protect middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 401 if no token", async () => {
    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Access denied. No token provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is invalid", async () => {
    req.cookies.jwt = "fakeToken";
    jwt.verify.mockImplementation(() => {
      throw { name: "JsonWebTokenError" };
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token. Please log in again",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is expired", async () => {
    req.cookies.jwt = "expiredToken";
    jwt.verify.mockImplementation(() => {
      throw { name: "TokenExpiredError" };
    });

    await protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token expired. Please log in again",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if user not found", async () => {
    req.cookies.jwt = "validToken";
    jwt.verify.mockReturnValue({ id: "user123" });
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await protect(req, res, next);
    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized. User not found",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next and attach user if token is valid and user exists", async () => {
    req.cookies.jwt = "validToken";
    jwt.verify.mockReturnValue({ id: "user123" });

    const mockUser = { _id: "user123", name: "Test User" };
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    await protect(req, res, next);
    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });
});
