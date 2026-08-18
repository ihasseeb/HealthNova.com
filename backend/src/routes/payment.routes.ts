import { Router } from "express";
import express from "express";
import {
  createAppointmentPayment,
  createSubscription,
  getPaymentHistory,
  getMySubscription,
  stripeWebhook,
} from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Stripe Webhook (MUST be before express.json() - needs raw body)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// Protected Routes
router.use(authenticate);

router.post("/appointment", createAppointmentPayment);
router.post("/subscribe", createSubscription);
router.get("/history", getPaymentHistory);
router.get("/subscription", getMySubscription);

export default router;
