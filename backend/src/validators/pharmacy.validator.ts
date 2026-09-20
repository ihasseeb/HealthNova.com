import { z } from "zod";

export const createOrderSchema = z.object({
  shippingAdd: z.string().min(10, "Full shipping address is required"),
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.number().int().min(1, "Quantity must be at least 1"),
      }),
    )
    .min(1, "Cart cannot be empty"),
});

export const bookTestSchema = z.object({
  testId: z.string().uuid("Invalid test ID"),
  bookingDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  address: z
    .string()
    .min(10, "Full address required for home collection")
    .optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type BookTestInput = z.infer<typeof bookTestSchema>;
