let ajInstance: any = null;
let isSpoofedBotFn: any = null;

// Dynamic Lazy Loader for Arcjet (ESM compatible)
export const getArcjet = async () => {
  if (ajInstance) {
    return { aj: ajInstance, isSpoofedBot: isSpoofedBotFn };
  }

  // Dynamic import for pure ESM modules in CommonJS
  const {
    default: arcjet,
    shield,
    detectBot,
    tokenBucket,
  } = await import("@arcjet/node");
  const { isSpoofedBot } = await import("@arcjet/inspect");

  isSpoofedBotFn = isSpoofedBot;

  const ARCJET_KEY = process.env.ARCJET_KEY;

  if (!ARCJET_KEY) {
    console.warn(
      "⚠️ ARCJET_KEY is missing in .env! Arcjet protection is disabled.",
    );
  }

  ajInstance = arcjet({
    key: ARCJET_KEY || "ajkey_placeholder",
    rules: [
      // 1. Shield: Protects against SQL Injection & XSS
      shield({ mode: "LIVE" }),

      // 2. Bot Detection: Block malicious scrapers
      detectBot({
        mode: "LIVE",
        allow: ["CATEGORY:SEARCH_ENGINE"],
      }),

      // 3. Token Bucket Rate Limiting
      tokenBucket({
        mode: "LIVE",
        refillRate: 15,
        interval: 10,
        capacity: 30,
      }),
    ],
  });

  return { aj: ajInstance, isSpoofedBot: isSpoofedBotFn };
};
