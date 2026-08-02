import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { errorResponse } from "../utils/apiResponse";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return errorResponse(res, 400, "Validation failed", errors);
      }
      return errorResponse(res, 500, "Something went wrong");
    }
  };
};
