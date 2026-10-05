import { Blog } from "../models/Blog.model.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

/**
 * POST /api/v1/blogs
 * Create a new blog
 */
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  const { title, description, content, tags, status } = req.body;

  if (!title || !description || !content) {
    throw new ApiError(400, "Title, description, content and  are required");
  }

  let normalizedTags: string[] = [];

  if (Array.isArray(tags)) {
    normalizedTags = tags;
  } else if (typeof tags === "string") {
    normalizedTags = tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean);
  }

  let featuredImage: string | null = null;

  if (req.file) {
    featuredImage = await uploadToCloudinary(
      req.file.buffer,
      "techsphere/blogs",
    );
  }

  const blog = await Blog.create({
    title,
    description,
    content,

    tags: normalizedTags,
    featuredImage,
    status: status === "published" ? "published" : "draft",
    author: userId,
  });

  const populatedBlog = await blog.populate({
    path: "author",
    select: "name email",
  });

  return res.status(201).json(
    apiResponse(blog, {
      message: "Blog created successfully",
      statusCode: 201,
    }),
  );
});

/**
 * PATCH /api/v1/blogs/:id
 * Update a blog
 */
export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid blog ID");
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to update this blog");
  }

  const { title, description, content, tags, status } = req.body;

  if (title !== undefined) {
    blog.title = title;
  }

  if (description !== undefined) {
    blog.description = description;
  }

  if (content !== undefined) {
    blog.content = content;
  }

  if (tags !== undefined) {
    if (Array.isArray(tags)) {
      blog.tags = tags;
    } else if (typeof tags === "string") {
      blog.tags = tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean);
    }
  }

  if (status !== undefined) {
    if (status !== "draft" && status !== "published") {
      throw new ApiError(400, "Status must be either draft or published");
    }

    blog.status = status;
  }

  if (req.file) {
    blog.featuredImage = await uploadToCloudinary(
      req.file.buffer,
      "techsphere/blogs",
    );
  }

  await blog.save();
  const populatedBlog = await blog.populate({
    path: "author",
    select: "name email",
  });

  return res.status(200).json(
    apiResponse(populatedBlog, {
      message: "Blog updated successfully",
      statusCode: 200,
    }),
  );
});

/**
 * DELETE /api/v1/blogs/:id
 * Delete a blog
 */
export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid blog ID");
  }
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  if (blog.author.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to delete this blog");
  }

  await blog.deleteOne();

  return res.status(200).json(
    apiResponse(null, {
      message: "Blog deleted successfully",
      statusCode: 200,
    }),
  );
});

/**
 * GET /api/v1/blogs
 * Get all published blogs
 */
export const getAllBlogs = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

  const skip = (page - 1) * limit;

  const { search } = req.query;

  const filter: Record<string, unknown> = {
    status: "published",
  };

  // Search blogs
  if (search && typeof search === "string") {
    filter.$text = {
      $search: search,
    };
  }

  const [blogs, totalBlogs] = await Promise.all([
    Blog.find(filter)
      .populate({
        path: "author",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Blog.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalBlogs / limit);

  return res.status(200).json(
    apiResponse(
      {
        blogs,
        pagination: {
          currentPage: page,
          totalPages,
          totalBlogs,
          limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      {
        message: "Blogs fetched successfully",
        statusCode: 200,
      },
    ),
  );
});

export const getBlogById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (
      typeof id !== "string" ||
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      throw new ApiError(400, "Invalid blog ID");
    }

    const blog = await Blog.findOne({
      _id: id,
      status: "published",
    })
      .populate({
        path: "author",
        select: "name email",
      })
      .lean();

    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }

    return res.status(200).json(
      apiResponse(blog, {
        message: "Blog fetched successfully",
        statusCode: 200,
      }),
    );
  },
);
