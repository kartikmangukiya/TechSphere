import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

export const router = Router();

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