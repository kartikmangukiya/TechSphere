import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";

export const router = Router();

router.post("/register", registerUser);
// router.post("/login");
// router.post("/logout");
// router.get("/me");
