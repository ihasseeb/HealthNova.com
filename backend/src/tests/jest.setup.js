// Jest setup: disable Arcjet protection during automated tests to avoid
// external network calls and noisy middleware errors.
process.env.ARCJET_KEY = "";

// Optionally silence Arcjet-related warnings in test output
process.env.NODE_ENV = process.env.NODE_ENV || "test";

console.log("[jest.setup] Arcjet protection disabled for tests");
