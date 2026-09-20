import { Router } from "express";
import {
  getAllProducts,
  createOrder,
  getAllLabTests,
  bookLabTest,
} from "../controllers/pharmacy.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createOrderSchema,
  bookTestSchema,
} from "../validators/pharmacy.validator";

const router = Router();

// Public Routes (Anyone can view catalog)
router.get("/products", getAllProducts);
router.get("/lab-tests", getAllLabTests);

// Protected Routes (Must login to buy)
router.use(authenticate);
router.post("/orders", validate(createOrderSchema), createOrder);
router.post("/book-test", validate(bookTestSchema), bookLabTest);

export default router;
