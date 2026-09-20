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

// ============================================
// COMPREHENSIVE EMR HEALTH TIMELINE AGGREGATOR
// ============================================

export interface TimelineEvent {
  id: string;
  type:
    | "APPOINTMENT"
    | "PRESCRIPTION"
    | "SYMPTOM_CHECK"
    | "HEALTH_REPORT"
    | "MOOD_LOG";
  title: string;
  description: string;
  date: Date;
  metadata?: any;
}

export const getHealthTimelineService = async (userId: string) => {
  // Aggregate data from 5 different tables in parallel for maximum speed!
  const [appointments, prescriptions, symptomChecks, reports, moodLogs] =
    await Promise.all([
      // 1. Appointments
      prisma.appointment.findMany({
        where: { patientId: userId },
        include: {
          doctor: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
        orderBy: { appointmentDate: "desc" },
        take: 20,
      }),

      // 2. Prescriptions
      prisma.prescription.findMany({
        where: { patientId: userId },
        include: {
          doctor: {
            include: {
              user: { select: { name: true } },
            },
          },
          medicines: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),

      // 3. AI Symptom Checks
      prisma.symptomCheck.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),

      // 4. Uploaded Health Reports
      prisma.healthReport.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),

      // 5. Mental Health Mood Logs
      prisma.moodLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

  // Transform all different records into a unified Timeline Event format
  const timeline: TimelineEvent[] = [];

  // Map Appointments
  appointments.forEach((apt) => {
    timeline.push({
      id: apt.id,
      type: "APPOINTMENT",
      title: `Doctor Consultation (${apt.type.replace("_", " ")})`,
      description: `Doctor: Dr. ${apt.doctor.user.name} | Reason: ${apt.reason}`,
      date: apt.appointmentDate,
      metadata: {
        status: apt.status,
        fee: apt.consultationFee,
        startTime: apt.startTime,
      },
    });
  });

  // Map Prescriptions
  prescriptions.forEach((rx) => {
    const medNames = rx.medicines.map((m) => m.medicineName).join(", ");
    timeline.push({
      id: rx.id,
      type: "PRESCRIPTION",
      title: `Digital Prescription Issued`,
      description: `Diagnosis: ${rx.diagnosis} | Medicines: ${medNames || "None"}`,
      date: rx.createdAt,
      metadata: {
        doctorName: rx.doctor.user.name,
        medicinesCount: rx.medicines.length,
        notes: rx.notes,
      },
    });
  });

  // Map Symptom Checks
  symptomChecks.forEach((sc) => {
    timeline.push({
      id: sc.id,
      type: "SYMPTOM_CHECK",
      title: `AI Symptom Analysis (${sc.severity} Severity)`,
      description: `Symptoms: "${sc.symptoms}" | Possible Causes: ${sc.possibleCauses.join(", ")}`,
      date: sc.createdAt,
      metadata: {
        severity: sc.severity,
        duration: sc.duration,
      },
    });
  });

  // Map Health Reports
  reports.forEach((hr) => {
    timeline.push({
      id: hr.id,
      type: "HEALTH_REPORT",
      title: `Uploaded ${hr.reportType} Analysis`,
      description: `Status: ${hr.overallStatus} | Summary: ${hr.summary}`,
      date: hr.createdAt,
      metadata: {
        status: hr.overallStatus,
        urgency: hr.urgency,
      },
    });
  });

  // Map Mood Logs
  moodLogs.forEach((ml) => {
    timeline.push({
      id: ml.id,
      type: "MOOD_LOG",
      title: `Mental Health & Mood Log (Score: ${ml.moodScore}/5)`,
      description: `Emotions: ${ml.emotions.join(", ")} | Note: ${ml.journalText || "No journal entry"}`,
      date: ml.createdAt,
      metadata: {
        moodScore: ml.moodScore,
        aiAnalysis: ml.aiAnalysis,
      },
    });
  });

  // Sort unified timeline by date in descending order (Newest first)
  timeline.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return timeline;
};
