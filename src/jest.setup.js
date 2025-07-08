import mongoose from "mongoose";
import { config } from "dotenv";

config({ path: ".env" });

jest.setTimeout(30000); //increase timeout for mongodb setup

beforeAll(async () => {
  // Connect to MongoDB before running tests
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  // Disconnect from MongoDB after tests are done
  await mongoose.connection.close();
});
