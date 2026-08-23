import api from "./api";

export interface DoctorProfileInput {
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualifications: string[];
  consultationFee: number;
  bio: string;
  profileImage?: string;
  languages?: string[];
  hospital?: string;
  address?: string;
}

// Get My Doctor Profile
export const getDoctorProfile = async () => {
  const response = await api.get("/doctor/profile");
  return response.data;
};

// Create Doctor Profile
export const createDoctorProfile = async (data: DoctorProfileInput) => {
  const response = await api.post("/doctor/profile", data);
  return response.data;
};

// Update Doctor Profile
export const updateDoctorProfile = async (
  data: Partial<DoctorProfileInput>,
) => {
  const response = await api.put("/doctor/profile", data);
  return response.data;
};
