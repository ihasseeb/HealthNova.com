import prisma from "../lib/prisma";
import stripe from "../lib/stripe";
import { AppError } from "../utils/AppError";

const db = prisma as any;

// ============================================
// APPOINTMENT PAYMENT
// ============================================

// Create Checkout Session (for appointment)
export const createAppointmentPaymentService = async (
  userId: string,
  appointmentId: string,
) => {
  // 1. Get appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: {
      doctor: {
        include: {
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.patientId !== userId) {
    throw new AppError("Not your appointment", 403);
  }

  if (appointment.isPaid) {
    throw new AppError("Already paid", 400);
  }

  // 2. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Consultation with Dr. ${appointment.doctor.user.name}`,
            description: `${appointment.type} appointment on ${appointment.appointmentDate}`,
          },
          unit_amount: Math.round(appointment.consultationFee * 100), // Cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      appointmentId: appointment.id,
      userId,
      type: "appointment",
    },
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
  });

  // 3. Save payment record
  await db.payment.create({
    data: {
      userId,
      appointmentId,
      amount: appointment.consultationFee,
      stripeSessionId: session.id,
      description: `Appointment with Dr. ${appointment.doctor.user.name}`,
    },
  });

  return { url: session.url, sessionId: session.id };
};

// ============================================
// SUBSCRIPTION
// ============================================

// Create Subscription Checkout
export const createSubscriptionService = async (
  userId: string,
  plan: string,
) => {
  // Plan prices (Stripe price IDs - create in Stripe Dashboard)
  const planPrices: Record<string, { price: number; name: string }> = {
    PRO: { price: 999, name: "Pro Plan" }, // $9.99
    PREMIUM: { price: 1999, name: "Premium Plan" }, // $19.99
  };

  if (!planPrices[plan]) {
    throw new AppError("Invalid plan", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment", // Use "subscription" for recurring
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `HealthNova AI - ${planPrices[plan].name}`,
            description: "Monthly subscription",
          },
          unit_amount: planPrices[plan].price,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      plan,
      type: "subscription",
    },
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
  });

  return { url: session.url, sessionId: session.id };
};

// ============================================
// PAYMENT HISTORY
// ============================================

// Get User's Payment History
export const getPaymentHistoryService = async (userId: string) => {
  const payments = await db.payment.findMany({
    where: { userId },
    include: {
      appointment: {
        include: {
          doctor: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return payments;
};

// Get User's Subscription
export const getUserSubscriptionService = async (userId: string) => {
  let subscription = await db.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    // Create FREE subscription
    subscription = await db.subscription.create({
      data: {
        userId,
        plan: "FREE",
        status: "ACTIVE",
      },
    });
  }

  return subscription;
};

// ============================================
// WEBHOOK HANDLER
// ============================================

// Handle Stripe Webhook
export const handleStripeWebhookService = async (event: any) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { userId, appointmentId, plan, type } = session.metadata;

      if (type === "appointment") {
        // Update payment status
        await db.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: {
            status: "COMPLETED",
            stripePaymentId: session.payment_intent,
          },
        });

        // Mark appointment as paid
        if (appointmentId) {
          await prisma.appointment.update({
            where: { id: appointmentId },
            data: { isPaid: true },
          });
        }
      }

      if (type === "subscription") {
        // Update or create subscription
        await db.subscription?.upsert({
          where: { userId },
          create: {
            userId,
            plan,
            status: "ACTIVE",
            stripeCustomerId: session.customer,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
          update: {
            plan,
            status: "ACTIVE",
            stripeCustomerId: session.customer,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const session = event.data.object;
      await db.payment.updateMany({
        where: { stripePaymentId: session.id },
        data: { status: "FAILED" },
      });
      break;
    }
  }
};
