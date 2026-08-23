import api from "./api";

// Get Overall Platform Analytics
export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Get Pending Doctor Verifications
export const getPendingDoctors = async () => {
  const response = await api.get("/admin/doctors/pending");
  return response.data;
};

// Verify a Doctor
export const verifyDoctor = async (doctorId: string) => {
  const response = await api.patch(`/admin/doctors/${doctorId}/verify`);
  return response.data;
};

// Get All Users (with pagination/role filter)
export const getAllUsers = async (params?: {
  role?: string;
  page?: number;
}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};
