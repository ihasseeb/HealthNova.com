import { z } from "zod";

export const uploadRecordSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),
  category: z.enum(
    [
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
    ] as const,
    {
      message: "Please select a category",
    },
  ),
  description: z.string().max(500, "Description too long").optional(),
  fileUrl: z.string().url("Valid file URL is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().min(1, "File size is required"),
});

export const shareRecordSchema = z.object({
  doctorId: z.string().min(1, "Please select a doctor to share with"),
});

export type UploadRecordFormData = z.infer<typeof uploadRecordSchema>;
export type ShareRecordFormData = z.infer<typeof shareRecordSchema>;
