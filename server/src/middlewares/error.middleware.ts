import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

/**
 * 404 Not Found handler for unmatched API routes.
 */
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(
    new ApiError(404, `API route not found: ${req.method} ${req.originalUrl}`, {
      code: "ROUTE_NOT_FOUND",
    }),
  );
};

/**
 * Global Express error handling middleware.
 * Ensures consistent JSON error responses across the API.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal server error";
  let code: string | undefined = "INTERNAL_SERVER_ERROR";
  let details: unknown = undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code;
    details = err.details;
  } else if (err instanceof Error) {
    if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid resource ID format";
      code = "INVALID_ID";
    } else if (err.name === "ValidationError") {
      statusCode = 400;
      message = err.message;
      code = "VALIDATION_ERROR";
    } else if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid or malformed authentication token";
      code = "INVALID_TOKEN";
    } else if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Authentication token has expired";
      code = "TOKEN_EXPIRED";
    } else if ("code" in err && (err as { code: number }).code === 11000) {
      statusCode = 409;
      message = "A resource with these unique credentials already exists";
      code = "DUPLICATE_RESOURCE";
    } else {
      message = err.message || message;
    }
  }

  // Ensure response status is set properly
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    code,
    ...(details !== undefined ? { details } : {}),
  });
};
