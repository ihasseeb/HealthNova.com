import { Request, Response } from "express";
import {
  createAppointmentPaymentService,
  createSubscriptionService,
  getPaymentHistoryService,
  getUserSubscriptionService,
  handleStripeWebhookService,
} from "../services/payment.service";
import stripe from "../lib/stripe";
import { successResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// Create Appointment Payment
export const createAppointmentPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { appointmentId } = req.body;
    const result = await createAppointmentPaymentService(userId, appointmentId);
    return successResponse(res, 200, "Payment session created", result);
  },
);

// Create Subscription Payment
export const createSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { plan } = req.body;
    const result = await createSubscriptionService(userId, plan);
    return successResponse(res, 200, "Subscription session created", result);
  },
);

// Get Payment History
export const getPaymentHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const payments = await getPaymentHistoryService(userId);
    return successResponse(res, 200, "Payment history", { payments });
  },
);

// Get My Subscription
export const getMySubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const subscription = await getUserSubscriptionService(userId);
    return successResponse(res, 200, "Subscription details", { subscription });
  },
);

// Stripe Webhook
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    await handleStripeWebhookService(event);
    res.json({ received: true });
  } catch (error: any) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
