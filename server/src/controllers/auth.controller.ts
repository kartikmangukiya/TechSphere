import type { Request, Response } from "express";
import bcrypt from "bcrypt";

import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { generateToken } from "../utils/generateToken.js";

// =========================
// Register
// =========================

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email and password are required", {
        code: "MISSING_REQUIRED_FIELDS",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ApiError(409, "Email already exists", {
        code: "EMAIL_ALREADY_EXISTS",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

// =========================
// Login
// =========================

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required", {
      code: "MISSING_CREDENTIALS",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password", {
      code: "INVALID_CREDENTIALS",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password", {
      code: "INVALID_CREDENTIALS",
    });
  }

  const token = generateToken(user._id.toString());

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    apiResponse(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      {
        message: "Login successful",
      },
    ),
  );
});

// =========================
// Logout
// =========================

export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json(
    apiResponse(null, {
      message: "Logout successful",
    }),
  );
});

// =========================
// Get Current User
// =========================

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "Authentication required", {
        code: "UNAUTHORIZED",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found", {
        code: "USER_NOT_FOUND",
      });
    }

    return res.status(200).json(
      apiResponse(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        {
          message: "Current user fetched successfully",
        },
      ),
    );
  },
);
