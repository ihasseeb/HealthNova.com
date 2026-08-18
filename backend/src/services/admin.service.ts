import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { notifyDoctorVerified } from "../utils/notification";

// Get all pending (unverified) doctors
export const getPendingDoctorsService = async () => {
  const doctors = await prisma.doctorProfile.findMany({
    where: { isVerified: false },
  });
  return doctors;
};

// Verify a specific doctor
export const verifyDoctorService = async (doctorProfileId: string) => {
  // Step 1: Find the doctor profile
  const profile = await prisma.doctorProfile.findUnique({
    where: { id: doctorProfileId },
  });

  // Step 2: If not found, throw error
  if (!profile) {
    throw new AppError("Doctor profile not found", 404);
  }

  // After verifying doctor:
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { id: doctorProfileId },
  });
  if (doctorProfile) {
    await notifyDoctorVerified(doctorProfile.userId);
  }

  // Step 3: Update the profile
  const updated = await prisma.doctorProfile.update({
    where: { id: doctorProfileId },
    data: {
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  // Step 4: Return updated
  return updated;
};
