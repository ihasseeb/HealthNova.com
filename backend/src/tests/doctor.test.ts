import { describe, it, expect, afterAll, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";
import { generateAccessToken } from "../utils/jwt";

describe("Doctor & Admin Verification Integration Tests", () => {
  let doctorUser: any;
  let doctorToken: string;
  let adminUser: any;
  let adminToken: string;
  let doctorProfileId: string;

  const timestamp = Date.now();
  const doctorEmail = `test_doc_${timestamp}@example.com`;
  const adminEmail = `test_admin_${timestamp}@example.com`;

  beforeAll(async () => {
    // 1. Create a Doctor User
    doctorUser = await prisma.user.create({
      data: {
        name: "Dr. Jest Test",
        email: doctorEmail,
        password: "Password123",
        role: "DOCTOR",
        isVerified: true,
      },
    });

    doctorToken = generateAccessToken({
      userId: doctorUser.id,
      email: doctorUser.email,
      role: doctorUser.role,
    });

    // 2. Create an Admin User
    adminUser = await prisma.user.create({
      data: {
        name: "Admin Jest Test",
        email: adminEmail,
        password: "Password123",
        role: "ADMIN",
        isVerified: true,
      },
    });

    adminToken = generateAccessToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });
  });

  afterAll(async () => {
    // Cleanup created test data
    await prisma.doctorProfile.deleteMany({
      where: { userId: doctorUser.id },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [doctorUser.id, adminUser.id] } },
    });
  });

  // 1. Create Doctor Profile
  describe("POST /api/doctor/profile", () => {
    it("should allow a doctor user to create a profile (201 Created)", async () => {
      const profileData = {
        specialization: "Cardiology",
        licenseNumber: `MED-${timestamp}`,
        experience: 8,
        qualifications: ["MBBS", "MD"],
        consultationFee: 100,
        bio: "Experienced cardiologist specializing in heart health and prevention.",
        hospital: "City Hospital",
      };

      const res = await request(app)
        .post("/api/doctor/profile")
        .set("Authorization", `Bearer ${doctorToken}`)
        .send(profileData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.profile).toHaveProperty("id");
      expect(res.body.data.profile.isVerified).toBe(false); // Unverified initially

      doctorProfileId = res.body.data.profile.id;
    });

    it("should reject duplicate doctor profile creation (400 Bad Request)", async () => {
      const profileData = {
        specialization: "Cardiology",
        licenseNumber: `MED-DUP-${timestamp}`,
        experience: 5,
        qualifications: ["MBBS"],
        consultationFee: 80,
        bio: "Duplicate profile test bio string for validation.",
      };

      const res = await request(app)
        .post("/api/doctor/profile")
        .set("Authorization", `Bearer ${doctorToken}`)
        .send(profileData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // 2. Fetch Doctor Profile
  describe("GET /api/doctor/profile", () => {
    it("should fetch the doctor profile for authenticated doctor (200 OK)", async () => {
      const res = await request(app)
        .get("/api/doctor/profile")
        .set("Authorization", `Bearer ${doctorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.profile.specialization).toBe("Cardiology");
    });
  });

  // 3. Public Get All Verified Doctors
  describe("GET /api/doctor/all", () => {
    it("should return a list of verified doctors (200 OK)", async () => {
      const res = await request(app).get("/api/doctor/all");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.doctors)).toBe(true);
    });
  });

  // 4. Admin Verification
  describe("Admin Doctor Verification APIs", () => {
    it("should list pending unverified doctors for Admin (200 OK)", async () => {
      const res = await request(app)
        .get("/api/admin/doctors/pending")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.doctors)).toBe(true);
    });

    it("should verify doctor when requested by Admin (200 OK)", async () => {
      const res = await request(app)
        .patch(`/api/admin/doctors/${doctorProfileId}/verify`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.doctor.isVerified).toBe(true);
    });
  });
});
