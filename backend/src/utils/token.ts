import crypto from "crypto";

// Generate random reset token
export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate token expiry (15 minutes from now)
export const generateTokenExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15);
  return expiry;
};

// Check if token is expired
export const isTokenExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};
