import mongoose from "mongoose";

jest.setTimeout(30000); //increase timeout for mongodb setup

beforeAll(async () => {
  // Connect to MongoDB before running tests
  await mongoose.connect("global.__MONGO_URI__", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from MongoDB after tests are done
  await mongoose.connection.close();
});
