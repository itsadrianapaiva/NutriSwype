# Testing NutriSwype

## Overview
NutriSwype uses Jest, Supertest, and MongoDB Memory Server for unit and integration tests, ensuring robust functionality for user authentication, profile management, swipes, and meal recommendations.

## Setup
- Install dependencies: `npm install --save-dev jest supertest mongodb-memory-server @shelf/jest-mongodb`
- Run tests: `npm test`
- Generate coverage: `npm run test:coverage`

## Test Coverage
- Auth: 90% (register, login, logout)
- User: 85% (getMe, updateProfile, getDashboard)
- Swipe: 80% (createSwipe, getUserSwipes)
- Meal: 80% (createMeal, getMeals)

## Sample Coverage Report
[link to coverage/index.html]