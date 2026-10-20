import { Router } from "express";
import {
  likeBlog,
  unlikeBlog,
  getBlogLikes,
} from "../controllers/like.controller.js";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id/likes", optionalAuthMiddleware, getBlogLikes);
router.post("/:id/like", authMiddleware, likeBlog);
router.delete("/:id/like", authMiddleware, unlikeBlog);

export default router;