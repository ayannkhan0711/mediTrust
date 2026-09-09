import express from "express";
import protect from "../middleware/authMiddleware.js";
import pathologistController from "../controller/pathologist/pathologistController.js";

const router = express.Router();

router.post(
    "/request",
    protect.forUser,
    pathologistController.becomePathologist
);

export default router;