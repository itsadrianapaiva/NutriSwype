export default {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  testMatch: ["**/?(*.)+(spec|test).js"],
  setupFilesAfterEnv: ["./src/jest.setup.js"],
  transform: { "^.+\\.js$": "babel-jest" },
};
