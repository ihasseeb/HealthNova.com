import request from "supertest";
import app from "../app";
import { describe, it, expect } from "@jest/globals";

describe("GET / (Root & Health Check APIs)", () => {
  it("should return 200 OK and running message for root route", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body.message).toContain("HealthNova AI Backend is running");
  });

  it("should return 200 OK for /health endpoint", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("should return 404 for invalid routes", async () => {
    const res = await request(app).get("/api/invalid-route-xyz");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("success", false);
  });
});
