# Testing NutriSwype

## Overview
NutriSwype uses Jest, Supertest, and MongoDB Memory Server for unit and integration tests, ensuring robust functionality for user authentication, profile management, swipes, and meal recommendations.
Tests are organized by controller (`authController.test.js`, `userController.test.js`, etc.) for clarity and maintainability.

## Setup
- Install dependencies: `npm install --save-dev jest supertest mongodb-memory-server @shelf/jest-mongodb`
- Run tests: `npm test`
- Generate coverage: `npm run test:coverage`

## Test Suite
- **authController.test.js**: Covers registration, login, and logout.
- **userController.test.js**: Tests user profile retrieval, updates, and dashboard stats.
- **swipeController.test.js**: Verifies swipe creation and retrieval.
- **mealController.test.js**: Ensures meal creation and filtering.
- **middleware.test.js**: Tests JWT authentication and input validation.

## Coverage
- Target: 80-90% coverage for controllers and middleware.
- [Link to coverage/index.html or screenshot]