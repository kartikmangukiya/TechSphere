import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blog.controller.js";
import {
  likeBlog,
  unlikeBlog,
  getBlogLikes,
} from "../controllers/like.controller.js";
import {
  getBlogComments,
  createComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import {
  authMiddleware,
  optionalAuthMiddleware,
} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export const router = Router();

// Blog CRUD routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post(
  "/",
  authMiddleware,
  upload.single("featuredImage"),
  createBlog,
);
router.patch(
  "/:id",
  authMiddleware,
  upload.single("featuredImage"),
  updateBlog,
);
router.delete("/:id", authMiddleware, deleteBlog);

// Likes routes
router.get("/:id/likes", optionalAuthMiddleware, getBlogLikes);
router.post("/:id/like", authMiddleware, likeBlog);
router.delete("/:id/like", authMiddleware, unlikeBlog);

// Comments routes
router.get("/:id/comments", getBlogComments);
router.post("/:id/comments", authMiddleware, createComment);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);