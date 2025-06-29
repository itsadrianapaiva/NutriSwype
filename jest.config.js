module.exports = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  testMatch: ["**/?(*.)+(spec|test).js"],
  setupFilesAfterEnv: ["./jest.setup.js"],
};
