import api from "./api";
import {
  UploadRecordFormData,
  ShareRecordFormData,
} from "../schemas/medicalRecordSchema";

// Upload Medical Record
export const uploadMedicalRecord = async (data: UploadRecordFormData) => {
  const response = await api.post("/medical-records", data);
  return response.data;
};

// Get My Medical Records (Optional category filter)
export const getMyMedicalRecords = async (category?: string) => {
  const response = await api.get("/medical-records", {
    params: { category },
  });
  return response.data;
};

// Delete Medical Record
export const deleteMedicalRecord = async (recordId: string) => {
  const response = await api.delete(`/medical-records/${recordId}`);
  return response.data;
};

// Share Record with Doctor
export const shareMedicalRecord = async (
  recordId: string,
  data: ShareRecordFormData,
) => {
  const response = await api.post(`/medical-records/${recordId}/share`, data);
  return response.data;
};

// Doctor: Get Shared Records
export const getSharedRecordsForDoctor = async () => {
  const response = await api.get("/medical-records/doctor/shared");
  return response.data;
};
