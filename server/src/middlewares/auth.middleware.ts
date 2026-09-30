import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

interface JwtPayload {
  userId: string;
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) {
    return next(
      new ApiError(401, "Authentication required", {
        code: "UNAUTHORIZED",
      }),
    );
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(
      new ApiError(500, "JWT secret is not configured", {
        code: "JWT_SECRET_MISSING",
      }),
    );
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: decoded.userId,
    };

    next();
  } catch {
    return next(
      new ApiError(401, "Invalid or expired token", {
        code: "INVALID_TOKEN",
      }),
    );
  }
};