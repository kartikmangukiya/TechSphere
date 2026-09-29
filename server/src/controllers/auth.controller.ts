import type { Request, Response } from "express";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // 1. Check required fields
    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email and password are required", {
        code: "MISSING_REQUIRED_FIELDS",
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "Email already exists", {
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // 4. Send successful response
    return res.status(201).json(
      apiResponse(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        {
          message: "User registered successfully",
        },
      ),
    );
  },
);
