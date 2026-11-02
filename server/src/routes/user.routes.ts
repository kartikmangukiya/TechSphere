import { Router } from "express";
import { getAuthorProfile } from "../controllers/user.controller.js";

export const router = Router();

router.get("/:id/profile", getAuthorProfile);
