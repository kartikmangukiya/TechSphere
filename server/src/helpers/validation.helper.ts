import mongoose from "mongoose";
import type { Request } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * Validates whether a value is a valid MongoDB ObjectId string.
 * Throws an ApiError (400) if invalid.
 */
export const validateObjectId = (
  id: string | string[] | undefined,
  fieldName = "ID",
): string => {
  const value = Array.isArray(id) ? id[0] : id;

  if (!value || typeof value !== "string" || !mongoose.isValidObjectId(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`, {
      code: `INVALID_${fieldName.toUpperCase().replace(/\s+/g, "_")}`,
    });
  }

  return value;
};

/**
 * Extracts and validates the authenticated user's ObjectId from Express Request.
 * Throws an ApiError (401) if missing or invalid.
 */
export const getAuthenticatedUserId = (
  req: Request,
): mongoose.Types.ObjectId => {
  const userId = req.user?.userId;

  if (!userId || !mongoose.isValidObjectId(userId)) {
    throw new ApiError(401, "Authentication required", {
      code: "UNAUTHORIZED",
    });
  }

  return new mongoose.Types.ObjectId(userId);
};
