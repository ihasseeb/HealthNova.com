import prisma from "../lib/prisma";
import stripe from "../lib/stripe";
import { AppError } from "../utils/AppError";
import type {
  CreateOrderInput,
  BookTestInput,
} from "../validators/pharmacy.validator";

// ==========================================
// E-PHARMACY (PRODUCTS & ORDERS)
// ==========================================

export const getAllProductsService = async () => {
  return await prisma.product.findMany({ orderBy: { category: "asc" } });
};

export const createOrderService = async (
  userId: string,
  data: CreateOrderInput,
) => {
  // 1. Fetch products & calculate total
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== data.items.length) {
    throw new AppError("Some products are invalid or out of stock", 400);
  }

  let totalAmount = 0;
  const lineItems: any[] = [];
  const orderItemsData: any[] = [];

  for (const item of data.items) {
    const product = products.find((p) => p.id === item.productId)!;

    if (product.stock < item.quantity) {
      throw new AppError(`Not enough stock for ${product.name}`, 400);
    }

    totalAmount += product.price * item.quantity;

    orderItemsData.push({
      productId: product.id,
      quantity: item.quantity,
      price: product.price,
    });

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: product.imageUrl ? [product.imageUrl] : [],
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: item.quantity,
    });
  }

  // 2. Create Order in DB (PENDING status)
  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      shippingAdd: data.shippingAdd,
      status: "PENDING",
      orderItems: { create: orderItemsData },
    },
  });

  // 3. Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    metadata: { orderId: order.id, type: "pharmacy_order" },
    success_url: `${process.env.FRONTEND_URL}/pharmacy/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pharmacy`,
  });

  // Update order with Stripe Session ID
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSession: session.id },
  });

  return { url: session.url, orderId: order.id };
};

// ==========================================
// LAB TESTS
// ==========================================

export const getAllLabTestsService = async () => {
  return await prisma.labTest.findMany({ orderBy: { category: "asc" } });
};

export const bookLabTestService = async (
  userId: string,
  data: BookTestInput,
) => {
  const test = await prisma.labTest.findUnique({ where: { id: data.testId } });

  if (!test) throw new AppError("Lab test not found", 404);
  if (test.homeSample && !data.address)
    throw new AppError("Address required for home collection", 400);

  // Create Booking
  const booking = await prisma.testBooking.create({
    data: {
      userId,
      testId: data.testId,
      bookingDate: new Date(data.bookingDate),
      address: data.address,
      status: "PENDING",
    },
  });

  // Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Lab Test: ${test.name}`,
            description: test.description,
          },
          unit_amount: Math.round(test.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id, type: "lab_test_booking" },
    success_url: `${process.env.FRONTEND_URL}/lab-tests/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/lab-tests`,
  });

  await prisma.testBooking.update({
    where: { id: booking.id },
    data: { stripeSession: session.id },
  });

  return { url: session.url, bookingId: booking.id };
};
