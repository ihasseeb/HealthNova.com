import api from "./api";
import { CreatePrescriptionFormData } from "../schemas/prescriptionSchema";

// Doctor: Create Prescription
export const createPrescription = async (data: CreatePrescriptionFormData) => {
  const response = await api.post("/prescriptions", data);
  return response.data;
};

// Doctor: Get My Created Prescriptions
export const getDoctorPrescriptions = async () => {
  const response = await api.get("/prescriptions/doctor/my-prescriptions");
  return response.data;
};

// Patient: Get My Prescriptions
export const getPatientPrescriptions = async () => {
  const response = await api.get("/prescriptions/patient/my-prescriptions");
  return response.data;
};

// Both: Get Prescription By ID
export const getPrescriptionById = async (prescriptionId: string) => {
  const response = await api.get(`/prescriptions/${prescriptionId}`);
  return response.data;
};
