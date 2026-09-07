import express from "express";

import authService from "../controller/auth/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authService.registerUser);
router.post("/login", authService.loginUser);
router.get("/me", protect.forUser, authService.getMyprofile);
router.put("/me", protect.forUser, authService.updateProfile);

export default router;