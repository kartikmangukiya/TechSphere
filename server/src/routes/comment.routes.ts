import { Router } from "express";

import {
  getBlogComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/:id/comments", getBlogComments);

router.post("/:id/comments", authMiddleware, createComment);

router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);

export default router;
