import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { errorResponse } from "../utils/apiResponse";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

// AUTHENTICATE Middleware - Verifies JWT token
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, 401, "No token provided. Please login.");
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, 401, "Invalid token format");
    }

    // 3. Verify token
    const decoded = verifyAccessToken(token);

    // 4. Attach user to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    // 5. Continue to next middleware/controller
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, 401, "Token expired. Please login again.");
    }
    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, 401, "Invalid token");
    }
    return errorResponse(res, 401, "Authentication failed");
  }
};

// AUTHORIZE Middleware - Role-based access control (RBAC)
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, 401, "Please login first");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      );
    }

    next();
  };
};
