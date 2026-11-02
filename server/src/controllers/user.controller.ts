import type { Request, Response } from "express";
import { Types } from "mongoose";

import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Blog } from "../models/Blog.model.js";
import { validateObjectId } from "../helpers/validation.helper.js";

/**
 * GET /api/v1/users/:id/profile
 * Get public author profile with stats and published articles
 */
export const getAuthorProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const authorId = validateObjectId(req.params.id, "author ID");

    const author = await User.findById(authorId).select("-password").lean();

    if (!author) {
      throw new ApiError(404, "Author not found", {
        code: "AUTHOR_NOT_FOUND",
      });
    }

    const [blogs, totalBlogs, totalViewsAggregate] = await Promise.all([
      Blog.find({ author: authorId, status: "published" })
        .populate({
          path: "author",
          select: "name email profileImage headline bio",
        })
        .sort({ createdAt: -1 })
        .lean(),
      Blog.countDocuments({ author: authorId, status: "published" }),
      Blog.aggregate<{ totalViews: number }>([
        {
          $match: {
            author: new Types.ObjectId(authorId),
            status: "published",
          },
        },
        { $group: { _id: null, totalViews: { $sum: "$views" } } },
      ]),
    ]);

    const totalViews = totalViewsAggregate[0]?.totalViews ?? 0;

    return res.status(200).json(
      apiResponse(
        {
          author: {
            id: author._id.toString(),
            _id: author._id.toString(),
            name: author.name,
            email: author.email,
            profileImage: author.profileImage || "",
            bio: author.bio || "",
            headline: author.headline || "",
            website: author.website || "",
            github: author.github || "",
            twitter: author.twitter || "",
            linkedin: author.linkedin || "",
            createdAt: author.createdAt,
          },
          stats: {
            totalBlogs,
            totalViews,
          },
          blogs,
        },
        {
          message: "Author profile fetched successfully",
          statusCode: 200,
        },
      ),
    );
  },
);
