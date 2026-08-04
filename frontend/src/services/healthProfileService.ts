import api from "./api";

// Create Profile
export const createHealthProfile = async (data: any) => {
  const response = await api.post("/health-profile", data);
  return response.data;
};

// Get Profile
export const getHealthProfile = async () => {
  const response = await api.get("/health-profile");
  return response.data;
};

// Update Profile
export const updateHealthProfile = async (data: any) => {
  const response = await api.put("/health-profile", data);
  return response.data;
};

// Delete Profile
export const deleteHealthProfile = async () => {
  const response = await api.delete("/health-profile");
  return response.data;
};
