import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { login, register, logout } from "../controllers/authController.js";

const router = Router();

router.post("/register", validate("register"), register);
router.post("/login", validate("login"), login);
router.post("/logout", validate("logout"), logout);

export default router;
