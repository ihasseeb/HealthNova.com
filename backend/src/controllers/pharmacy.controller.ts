import { Request, Response } from "express";
import {
  getAllProductsService,
  createOrderService,
  getAllLabTestsService,
  bookLabTestService,
} from "../services/pharmacy.service";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const products = await getAllProductsService();
    return successResponse(res, 200, "Products fetched", { products });
  },
);

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await createOrderService(userId, req.body);
  return successResponse(res, 201, "Order created, proceed to payment", result);
});

export const getAllLabTests = asyncHandler(
  async (req: Request, res: Response) => {
    const tests = await getAllLabTestsService();
    return successResponse(res, 200, "Lab tests fetched", { tests });
  },
);

export const bookLabTest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await bookLabTestService(userId, req.body);
  return successResponse(
    res,
    201,
    "Lab test booked, proceed to payment",
    result,
  );
});
