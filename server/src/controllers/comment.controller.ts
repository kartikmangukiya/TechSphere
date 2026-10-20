import type { Request, Response } from "express";

import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Blog } from "../models/Blog.model.js";
import Comment from "../models/Comment.model.js";
import {
  getAuthenticatedUserId,
  validateObjectId,
} from "../helpers/validation.helper.js";

/**
 * GET /api/v1/blogs/:id/comments
 * Fetch comments for a blog.
 */
export const getBlogComments = asyncHandler(
  async (req: Request, res: Response) => {
    const blogId = validateObjectId(req.params.id, "blog ID");

    const blog = await Blog.findById(blogId).select("_id status");
    if (!blog) {
      throw new ApiError(404, "Blog not found", {
        code: "BLOG_NOT_FOUND",
      });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

    const [comments, total] = await Promise.all([
      Comment.find({ blog: blog._id })
        .populate("author", "name email")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Comment.countDocuments({ blog: blog._id }),
    ]);

    return res.status(200).json(
      apiResponse(
        {
          comments,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
        {
          message: "Blog comments fetched successfully",
          statusCode: 200,
        },
      ),
    );
  },
);

/**
 * POST /api/v1/blogs/:id/comments
 * Add a comment to a blog.
 */
export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(req);
    const blogId = validateObjectId(req.params.id, "blog ID");

    const content =
      typeof req.body?.content === "string" ? req.body.content.trim() : "";

    if (!content) {
      throw new ApiError(400, "Comment content is required", {
        code: "COMMENT_REQUIRED",
      });
    }

    if (content.length > 2000) {
      throw new ApiError(400, "Comment cannot exceed 2000 characters", {
        code: "COMMENT_TOO_LONG",
      });
    }

    const blog = await Blog.findById(blogId).select("_id status");
    if (!blog) {
      throw new ApiError(404, "Blog not found", {
        code: "BLOG_NOT_FOUND",
      });
    }

    if (blog.status && blog.status !== "published") {
      throw new ApiError(400, "Cannot comment on an unpublished blog", {
        code: "BLOG_NOT_PUBLISHED",
      });
    }

    const comment = await Comment.create({
      blog: blog._id,
      author: userId,
      content,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name email")
      .lean();

    return res.status(201).json(
      apiResponse(populatedComment, {
        message: "Comment created successfully",
        statusCode: 201,
      }),
    );
  },
);

/**
 * DELETE /api/v1/blogs/:id/comments/:commentId
 * Delete a comment if the current user owns it.
 */
export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getAuthenticatedUserId(req);

    const blogId = validateObjectId(req.params.id, "blog ID");
    const commentId = validateObjectId(req.params.commentId, "comment ID");

    const comment = await Comment.findOne({
      _id: commentId,
      blog: blogId,
    });

    if (!comment) {
      throw new ApiError(404, "Comment not found", {
        code: "COMMENT_NOT_FOUND",
      });
    }

    if (comment.author.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own comments", {
        code: "FORBIDDEN",
      });
    }

    await comment.deleteOne();

    return res.status(200).json(
      apiResponse(
        {
          commentId: comment._id,
          deleted: true,
        },
        {
          message: "Comment deleted successfully",
          statusCode: 200,
        },
      ),
    );
  },
);
