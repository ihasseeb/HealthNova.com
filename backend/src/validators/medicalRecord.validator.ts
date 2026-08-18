import { z } from "zod";

const RecordCategory = z.enum([
  "LAB_REPORT",
  "XRAY",
  "MRI",
  "CT_SCAN",
  "PRESCRIPTION",
  "VACCINATION",
  "INSURANCE",
  "ECG",
  "ULTRASOUND",
  "GENERAL",
]);

export const uploadRecordSchema = z.object({
  title: z.string().min(3, "Title required").max(100),
  category: RecordCategory.default("GENERAL"),
  description: z.string().max(500).optional(),
  fileUrl: z.string().url("Invalid file URL"),
  fileType: z.string().min(1, "File type required"),
  fileSize: z.number().min(1, "File size required"),
});

export const updateRecordSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  category: RecordCategory.optional(),
  description: z.string().max(500).optional(),
});

export const shareRecordSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID"),
});

export type UploadRecordInput = z.infer<typeof uploadRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type ShareRecordInput = z.infer<typeof shareRecordSchema>;
