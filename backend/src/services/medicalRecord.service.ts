import prisma from "../lib/prisma";
import { AppError } from "../utils/AppError";
import type {
  UploadRecordInput,
  UpdateRecordInput,
  ShareRecordInput,
} from "../validators/medicalRecord.validator";

// Upload Medical Record
export const uploadRecordService = async (
  userId: string,
  data: UploadRecordInput,
) => {
  const record = await prisma.medicalRecord.create({
    data: {
      userId,
      uploadedBy: userId,
      ...data,
    },
  });

  return record;
};

// Get My Medical Records
export const getMyRecordsService = async (
  userId: string,
  category?: string,
) => {
  const where: any = { userId };
  if (category) {
    where.category = category;
  }

  const records = await prisma.medicalRecord.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return records;
};

// Get Single Record
export const getRecordByIdService = async (
  userId: string,
  recordId: string,
) => {
  const record = await prisma.medicalRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  // Check access: owner or shared doctor
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  const isOwner = record.userId === userId;
  const isSharedDoctor =
    doctorProfile && record.sharedWithDoctors.includes(doctorProfile.id);

  if (!isOwner && !isSharedDoctor) {
    throw new AppError("Access denied", 403);
  }

  return record;
};

// Update Record
export const updateRecordService = async (
  userId: string,
  recordId: string,
  data: UpdateRecordInput,
) => {
  const record = await prisma.medicalRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  if (record.userId !== userId) {
    throw new AppError("You can only update your own records", 403);
  }

  const updated = await prisma.medicalRecord.update({
    where: { id: recordId },
    data,
  });

  return updated;
};

// Delete Record
export const deleteRecordService = async (userId: string, recordId: string) => {
  const record = await prisma.medicalRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  if (record.userId !== userId) {
    throw new AppError("You can only delete your own records", 403);
  }

  await prisma.medicalRecord.delete({
    where: { id: recordId },
  });

  return { message: "Record deleted successfully" };
};

// Share Record with Doctor
export const shareRecordService = async (
  userId: string,
  recordId: string,
  data: ShareRecordInput,
) => {
  const record = await prisma.medicalRecord.findUnique({
    where: { id: recordId },
  });

  if (!record) {
    throw new AppError("Record not found", 404);
  }

  if (record.userId !== userId) {
    throw new AppError("You can only share your own records", 403);
  }

  // Check doctor exists
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: data.doctorId },
  });

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  // Check if already shared
  if (record.sharedWithDoctors.includes(data.doctorId)) {
    throw new AppError("Already shared with this doctor", 400);
  }

  // Add doctor to shared list
  const updated = await prisma.medicalRecord.update({
    where: { id: recordId },
    data: {
      sharedWithDoctors: {
        push: data.doctorId,
      },
    },
  });

  return updated;
};

// Get Records Shared with Doctor
export const getSharedRecordsService = async (userId: string) => {
  const doctorProfile = await prisma.doctorProfile.findUnique({
    where: { userId },
  });

  if (!doctorProfile) {
    throw new AppError("Doctor profile not found", 404);
  }

  const records = await prisma.medicalRecord.findMany({
    where: {
      sharedWithDoctors: {
        has: doctorProfile.id,
      },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return records;
};
