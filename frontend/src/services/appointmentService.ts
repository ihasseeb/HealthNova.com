import api from "./api";

export interface BookAppointmentInput {
  doctorId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  type: "IN_PERSON" | "VIDEO_CALL" | "PHONE_CALL";
  reason: string;
  notes?: string;
}

export interface SetAvailabilityInput {
  slots: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
}

// Patient: Book Appointment
export const bookAppointment = async (data: BookAppointmentInput) => {
  const response = await api.post("/appointments/book", data);
  return response.data;
};

// Patient: Get My Appointments
export const getPatientAppointments = async () => {
  const response = await api.get("/appointments/my-appointments");
  return response.data;
};

// Patient: Cancel Appointment
export const cancelAppointment = async (appointmentId: string) => {
  const response = await api.patch(`/appointments/${appointmentId}/cancel`);
  return response.data;
};

// Doctor: Get Doctor Appointments
export const getDoctorAppointments = async () => {
  const response = await api.get("/appointments/doctor/appointments");
  return response.data;
};

// Doctor: Update Status (CONFIRMED / COMPLETED / CANCELLED)
export const updateAppointmentStatus = async (
  appointmentId: string,
  data: { status: string; notes?: string },
) => {
  const response = await api.patch(
    `/appointments/${appointmentId}/update`,
    data,
  );
  return response.data;
};

// Doctor: Set Availability Slots
export const setDoctorAvailability = async (data: SetAvailabilityInput) => {
  const response = await api.post("/appointments/doctor/availability", data);
  return response.data;
};

// Public: Get Doctor Availability
export const getDoctorAvailability = async (doctorId: string) => {
  const response = await api.get(
    `/appointments/doctor/${doctorId}/availability`,
  );
  return response.data;
};
