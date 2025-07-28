import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import authRoutes from "../routes/authRoutes.js";
import User from "../models/User.js";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth routes", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await User.create({
      name: "Test User",
      email: "test@test.com",
      password: await bcrypt.hash("123456", 10),
    });
  });

  beforeEach(async () => {
    await mongoose.connection.collection("users").deleteMany({});
  });

  it("POST /api/auth/register should register a new user", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "123456",
      name: "Test",
    });
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "User registered successfully",
        user: expect.objectContaining({
          email: "test@test.com",
          name: "Test",
        }),
      })
    );
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("POST /api/auth/login should login a user", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "123456",
      name: "Test",
    });
    const response = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
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
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
