import { Request, Response, NextFunction } from "express";
import { getArcjet } from "../lib/arcjet";
import { errorResponse } from "../utils/apiResponse";
import logger from "../utils/logger";

export const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Skip Arcjet if Key is missing
  if (!process.env.ARCJET_KEY) {
    return next();
  }

  // Skip Stripe Webhook
  if (req.originalUrl === "/api/payments/webhook") {
    return next();
  }

  try {
    // Load Arcjet dynamically
    const { aj, isSpoofedBot } = await getArcjet();

    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        logger.warn(`🛡️ [Arcjet] Rate Limit Exceeded for IP: ${req.ip}`);
        return errorResponse(
          res,
          429,
          "Too many requests. Please slow down and try again in a few seconds.",
        );
      }

      if (decision.reason.isBot()) {
        logger.warn(`🛡️ [Arcjet] Bot Detected and Blocked: ${req.ip}`);
        return errorResponse(
          res,
          403,
          "Access denied: Automated bots are not allowed.",
        );
      }

      if (decision.reason.isShield()) {
        logger.error(
          `🛡️ [Arcjet] Malicious Attack Blocked (WAF/Shield) from IP: ${req.ip}`,
        );
        return errorResponse(
          res,
          403,
          "Access denied: Suspicious request blocked for security.",
        );
      }

      logger.warn(`🛡️ [Arcjet] Request Denied for IP: ${req.ip}`);
      return errorResponse(res, 403, "Access denied by security firewall.");
    }

    if (decision.results.some(isSpoofedBot)) {
      logger.warn(`🛡️ [Arcjet] Spoofed Bot Detected from IP: ${req.ip}`);
      return errorResponse(res, 403, "Access denied: Spoofed bot detected.");
    }

    next();
  } catch (error: any) {
    logger.error("❌ Arcjet Middleware Error:", error.message);
    next(); // Fail-open on error so app doesn't crash
  }
};
