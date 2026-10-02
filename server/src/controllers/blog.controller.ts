import type { Request, Response } from "express";
import { Blog } from "../models/Blog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const createBlog = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const deleteBlog = asyncHandler(
  async (req: Request, res: Response) => {},
);
export const updateBlog = asyncHandler(
  async (req: Request, res: Response) => {},
);
export const getAllBlogs = asyncHandler(
  async (req: Request, res: Response) => {},
);
export const getBlogById = asyncHandler(
  async (req: Request, res: Response) => {},
);
