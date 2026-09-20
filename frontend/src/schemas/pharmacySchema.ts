import { z } from "zod";

export const checkoutOrderSchema = z.object({
  shippingAdd: z.string().min(10, "Please provide a complete shipping address"),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      }),
    )
    .min(1, "Cart is empty"),
});

export const bookLabTestSchema = z.object({
  testId: z.string(),
  bookingDate: z.string().min(1, "Please select a date"),
  address: z.string().optional(),
});

export type CheckoutOrderFormData = z.infer<typeof checkoutOrderSchema>;
export type BookLabTestFormData = z.infer<typeof bookLabTestSchema>;
