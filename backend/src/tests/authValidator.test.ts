import { signupSchema, loginSchema } from "../validators/auth.validator";
import { describe, it, expect } from "@jest/globals";
describe("Auth Zod Validators Unit Tests", () => {
  it("should pass validation for valid signup data", () => {
    const validData = {
      name: "Haseeb Ahmed",
      email: "haseeb@example.com",
      password: "Password123",
    };

    const result = signupSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail validation for weak password", () => {
    const invalidData = {
      name: "Haseeb Ahmed",
      email: "haseeb@example.com",
      password: "123", // Weak password
    };

    const result = signupSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should pass login validation for valid input", () => {
    const validLogin = {
      email: "haseeb@example.com",
      password: "Password123",
    };

    const result = loginSchema.safeParse(validLogin);
    expect(result.success).toBe(true);
  });
});
