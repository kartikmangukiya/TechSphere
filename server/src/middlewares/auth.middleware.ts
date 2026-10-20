import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

interface JwtPayload {
  userId: string;
}

/**
 * Extracts the JWT token from cookies or the Authorization Bearer header.
 */
export const extractToken = (req: Request): string | undefined => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }

  return undefined;
};

/**
 * Strict authentication middleware.
 * Throws 401 if token is missing or invalid.
 */
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req);

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
      userId: decoded.userId,
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

/**
 * Optional authentication middleware.
 * If a valid token is present, populates req.user.
 * If not present or invalid, proceeds without failing.
 */
export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (decoded?.userId) {
      req.user = {
        userId: decoded.userId,
      };
    }
  } catch {
    // Silently continue for optional authentication
  }

  return next();
};