import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const router = Router();

router.get("/");
router.get("/:id");

// Protected Routes
router.post("/", authMiddleware);
router.patch("/:id", authMiddleware);
router.delete("/:id", authMiddleware);
