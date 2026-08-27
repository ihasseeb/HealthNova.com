import { describe, it, expect, afterAll, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../app";
import prisma from "../lib/prisma";
import { generateAccessToken } from "../utils/jwt";

// Increase default jest timeout for potentially slow integration tests
jest.setTimeout(20000);

describe("Appointment System Integration Tests", () => {
  let patientUser: any;
  let patientToken: string;
  let doctorUser: any;
  let doctorToken: string;
  let doctorProfile: any;
  let createdAppointmentId: string;

  const timestamp = Date.now();

  beforeAll(async () => {
    // 1. Create Patient User
    patientUser = await prisma.user.create({
      data: {
        name: "Patient Jest",
        email: `patient_${timestamp}@example.com`,
        password: "Password123",
        role: "PATIENT",
        isVerified: true,
      },
    });

    patientToken = generateAccessToken({
      userId: patientUser.id,
      email: patientUser.email,
      role: patientUser.role,
    });

    // 2. Create Doctor User & Verified Profile
    doctorUser = await prisma.user.create({
      data: {
        name: "Dr. Appointment Jest",
        email: `doc_apt_${timestamp}@example.com`,
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

    doctorProfile = await prisma.doctorProfile.create({
      data: {
        userId: doctorUser.id,
        specialization: "General Physician",
        licenseNumber: `LIC-APT-${timestamp}`,
        experience: 10,
        qualifications: ["MBBS"],
        consultationFee: 50,
        bio: "General physician bio text for testing appointment booking flow.",
        isVerified: true, // Already verified by admin for booking
      },
    });
  });

  afterAll(async () => {
    // Cleanup created test data
    if (patientUser?.id) {
      await prisma.appointment.deleteMany({
        where: { patientId: patientUser.id },
      });
    }

    if (doctorProfile?.id) {
      await prisma.availabilitySlot.deleteMany({
        where: { doctorId: doctorProfile.id },
      });
      await prisma.doctorProfile.deleteMany({
        where: { id: doctorProfile.id },
      });
    }

    const userIds: string[] = [];
    if (patientUser?.id) userIds.push(patientUser.id);
    if (doctorUser?.id) userIds.push(doctorUser.id);
    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });

  // 1. Set Doctor Availability
  describe("POST /api/appointments/doctor/availability", () => {
    it("should allow doctor to set weekly availability slots (201 Created)", async () => {
      const res = await request(app)
        .post("/api/appointments/doctor/availability")
        .set("Authorization", `Bearer ${doctorToken}`)
        .send({
          slots: [
            { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
            { dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  // 2. Book Appointment
  describe("POST /api/appointments/book", () => {
    it("should allow patient to book an appointment (201 Created)", async () => {
      // Future date for booking (7 days from now)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const bookingData = {
        doctorId: doctorProfile.id,
        appointmentDate: futureDate.toISOString().split("T")[0],
        startTime: "10:00",
        endTime: "10:30",
        type: "IN_PERSON",
        reason: "Routine health checkup and consultation.",
      };

      const res = await request(app)
        .post("/api/appointments/book")
        .set("Authorization", `Bearer ${patientToken}`)
        .send(bookingData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.appointment).toHaveProperty("id");
      expect(res.body.data.appointment.status).toBe("PENDING");

      createdAppointmentId = res.body.data.appointment.id;
    });
  });

  // 3. Get Patient Appointments
  describe("GET /api/appointments/my-appointments", () => {
    it("should return the list of patient appointments (200 OK)", async () => {
      const res = await request(app)
        .get("/api/appointments/my-appointments")
        .set("Authorization", `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.appointments)).toBe(true);
      expect(res.body.data.appointments.length).toBeGreaterThan(0);
    });
  });

  // 4. Doctor Updates Appointment Status
  describe("PATCH /api/appointments/:id/update", () => {
    it("should allow doctor to confirm appointment status (200 OK)", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${createdAppointmentId}/update`)
        .set("Authorization", `Bearer ${doctorToken}`)
        .send({
          status: "CONFIRMED",
          notes: "Appointment confirmed by doctor.",
        });

      expect(res.status).toBe(200);
      expect(res.body.data.appointment.status).toBe("CONFIRMED");
    });
  });

  // 5. Patient Cancels Appointment
  describe("PATCH /api/appointments/:id/cancel", () => {
    it("should allow patient to cancel appointment (200 OK)", async () => {
      const res = await request(app)
        .patch(`/api/appointments/${createdAppointmentId}/cancel`)
        .set("Authorization", `Bearer ${patientToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.appointment.status).toBe("CANCELLED");
    });
  });
});
