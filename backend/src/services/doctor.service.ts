import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import type {
  CreateDoctorProfileInput,
  UpdateDoctorProfileInput,
} from "../validators/doctor.validator";

// CREATE Doctor Profile
export const createDoctorProfileService = async (
  userId: string,
  data: CreateDoctorProfileInput,
) => {
  // 1. Check user exists and is DOCTOR
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "DOCTOR") {
    throw new AppError("Only doctors can create profile", 403);
  }

  // 2. Check profile already exists
  const existing = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new AppError(
      "Doctor profile already exists. Use update instead.",
      400,
    );
  }

  // 3. Check license number unique
  const licenseExists = await prisma.doctorProfile.findUnique({
    where: { licenseNumber: data.licenseNumber },
  });

  if (licenseExists) {
    throw new AppError("License number already registered", 400);
  }

  // 4. Create profile
  const profile = await prisma.doctorProfile.create({
    data: {
      userId,
      ...data,
    },
  });

  return profile;
};

// GET Doctor Profile
export const getDoctorProfileService = async (userId: string) => {
  const profile = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new AppError(
      "Doctor profile not found. Please create one first.",
      404,
    );
  }

  return profile;
};

// UPDATE Doctor Profile
export const updateDoctorProfileService = async (
  userId: string,
  data: UpdateDoctorProfileInput,
) => {
  // Check profile exists
  const existing = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new AppError(
      "Doctor profile not found. Please create one first.",
      404,
    );
  }

  // Update profile
  const profile = await prisma.doctorProfile.update({
    where: { userId },
    data,
  });

  return profile;
};

// GET ALL VERIFIED DOCTORS (Public for Patients)
export const getAllVerifiedDoctorsService = async () => {
  const doctors = await prisma.doctorProfile.findMany({
    where: { isVerified: true },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return doctors;
};
