// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate OTP expiry (10 minutes from now)
export const generateOTPExpiry = (): Date => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
};

// Check if OTP is expired
export const isOTPExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};
