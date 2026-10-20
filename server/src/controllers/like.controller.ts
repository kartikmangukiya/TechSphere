import type { Request, Response } from "express";
import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Like from "../models/Like.model.js";
import { Blog } from "../models/Blog.model.js";
import {
  getAuthenticatedUserId,
  validateObjectId,
} from "../helpers/validation.helper.js";

/**
 * POST /api/v1/blogs/:id/like
 * Like a blog.
 */
export const likeBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const blogId = validateObjectId(req.params.id, "blog ID");

  const blog = await Blog.findById(blogId).select("_id status");
  if (!blog) {
    throw new ApiError(404, "Blog not found", {
      code: "BLOG_NOT_FOUND",
    });
  }

  if (blog.status && blog.status !== "published") {
    throw new ApiError(400, "Cannot like an unpublished blog", {
      code: "BLOG_NOT_PUBLISHED",
    });
  }

  // Atomically create the like if it does not already exist.
  const like = await Like.findOneAndUpdate(
    {
      blog: blog._id,
      user: userId,
    },
    {
      $setOnInsert: {
        blog: blog._id,
        user: userId,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    },
  );

  const likeCount = await Like.countDocuments({
    blog: blog._id,
  });

  return res.status(200).json(
    apiResponse(
      {
        isLiked: true,
        likeCount,
        like,
      },
      {
        message: "Blog liked successfully",
        statusCode: 200,
      },
    ),
  );
});

/**
 * DELETE /api/v1/blogs/:id/like
 * Unlike a blog.
 */
export const unlikeBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);
  const blogId = validateObjectId(req.params.id, "blog ID");

  const blog = await Blog.findById(blogId).select("_id");
  if (!blog) {
    throw new ApiError(404, "Blog not found", {
      code: "BLOG_NOT_FOUND",
    });
  }

  await Like.findOneAndDelete({
    blog: blog._id,
    user: userId,
  });

  const likeCount = await Like.countDocuments({
    blog: blog._id,
  });

  return res.status(200).json(
    apiResponse(
      {
        isLiked: false,
        likeCount,
      },
      {
        message: "Blog unliked successfully",
        statusCode: 200,
      },
    ),
  );
});

/**
 * GET /api/v1/blogs/:id/likes
 * Get the like count and current user's like status.
 */
export const getBlogLikes = asyncHandler(async (req: Request, res: Response) => {
  const blogId = validateObjectId(req.params.id, "blog ID");

  const blog = await Blog.findById(blogId).select("_id status");
  if (!blog) {
    throw new ApiError(404, "Blog not found", {
      code: "BLOG_NOT_FOUND",
    });
  }

  const likeCount = await Like.countDocuments({
    blog: blog._id,
  });

  let isLiked = false;
  const userId = req.user?.userId;

  if (userId && mongoose.isValidObjectId(userId)) {
    isLiked = Boolean(
      await Like.exists({
        blog: blog._id,
        user: new mongoose.Types.ObjectId(userId),
      }),
    );
  }

  return res.status(200).json(
    apiResponse(
      {
        likeCount,
        isLiked,
      },
      {
        message: "Blog likes fetched successfully",
        statusCode: 200,
      },
    ),
  );
});
