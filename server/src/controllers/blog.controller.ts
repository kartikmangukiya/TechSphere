import { Blog } from "../models/Blog.model.js";
import type { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import {
  getAuthenticatedUserId,
  validateObjectId,
} from "../helpers/validation.helper.js";

const parseTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => String(t).trim()).filter(Boolean);
      }
    } catch {
      // not JSON, proceed to comma split
    }

    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

/**
 * POST /api/v1/blogs
 * Create a new blog
 */
export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const userId = getAuthenticatedUserId(req);

  const { title, description, content, tags, status } = req.body;

  if (!title || !description || !content) {
    throw new ApiError(400, "Title, description and content are required", {
      code: "MISSING_REQUIRED_FIELDS",
    });
  }

  const normalizedTags = parseTags(tags);

  let featuredImage: string | null = null;
  if (req.file) {
    featuredImage = await uploadToCloudinary(
      req.file.buffer,
      "techsphere/blogs",
    );
  }

  const blog = await Blog.create({
    title: String(title).trim(),
    description: String(description).trim(),
    content: String(content).trim(),
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
    apiResponse(populatedBlog, {
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
  const userId = getAuthenticatedUserId(req);
  const id = validateObjectId(req.params.id, "blog ID");

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found", {
      code: "BLOG_NOT_FOUND",
    });
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to update this blog", {
      code: "FORBIDDEN",
    });
  }

  const { title, description, content, tags, status } = req.body;

  if (title !== undefined) {
    blog.title = String(title).trim();
  }

  if (description !== undefined) {
    blog.description = String(description).trim();
  }

  if (content !== undefined) {
    blog.content = String(content).trim();
  }

  if (tags !== undefined) {
    blog.tags = parseTags(tags);
  }

  if (status !== undefined) {
    if (status !== "draft" && status !== "published") {
      throw new ApiError(400, "Status must be either draft or published", {
        code: "INVALID_STATUS",
      });
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
  const userId = getAuthenticatedUserId(req);
  const id = validateObjectId(req.params.id, "blog ID");

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(404, "Blog not found", {
      code: "BLOG_NOT_FOUND",
    });
  }

  if (blog.author.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to delete this blog", {
      code: "FORBIDDEN",
    });
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
  if (search && typeof search === "string" && search.trim()) {
    filter.$text = {
      $search: search.trim(),
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

/**
 * GET /api/v1/blogs/:id
 * Get single blog by ID
 */
export const getBlogById = asyncHandler(async (req: Request, res: Response) => {
  const id = validateObjectId(req.params.id, "blog ID");

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
    throw new ApiError(404, "Blog not found", {
      code: "BLOG_NOT_FOUND",
    });
  }

  return res.status(200).json(
    apiResponse(blog, {
      message: "Blog fetched successfully",
      statusCode: 200,
    }),
  );
});
