import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { errorResponse } from "../utils/apiResponse";

// Global Error Handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log error for debugging
  console.error("❌ Error:", err.message);

  // AppError (custom errors)
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message);
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    return errorResponse(res, 400, "Database error occurred");
  }

  // Validation errors
  if (err.name === "ValidationError") {
    return errorResponse(res, 400, err.message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token expired");
  }

  // Default 500 error
  return errorResponse(
    res,
    500,
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  );
};

// 404 Not Found Handler
export const notFoundHandler = (req: Request, res: Response) => {
  return errorResponse(res, 404, `Route ${req.originalUrl} not found`);
};
