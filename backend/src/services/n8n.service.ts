// src/services/n8n.service.ts
import axios from "axios";

export class N8nService {
  // 1. AI Health Query Trigger
  static async triggerAiTriage(payload: {
    patientName: string;
    symptoms: string;
    age?: number;
  }) {
    try {
      const response = await axios.post(
        process.env.N8N_AI_TRIAGE_WEBHOOK!,
        payload,
        {
          headers: { "x-n8n-secret": process.env.N8N_SECRET_TOKEN },
        },
      );
      return response.data;
    } catch (error: any) {
      console.error("n8n AI Triage Error:", error.message);
      throw new Error("AI Service temporary unavailable");
    }
  }

  // 2. Appointment Booking Trigger (WhatsApp + Email + Google Calendar)
  static async triggerAppointmentFlow(appointmentData: any) {
    try {
      // Non-blocking trigger (fire and forget ya async handle karein)
      axios
        .post(process.env.N8N_APPOINTMENT_NOTIFY_WEBHOOK!, appointmentData, {
          headers: { "x-n8n-secret": process.env.N8N_SECRET_TOKEN },
        })
        .catch((err) =>
          console.error("Async n8n notification error:", err.message),
        );
    } catch (error: any) {
      console.error("n8n Appointment Trigger Error:", error.message);
    }
  }

  // 3. Medical Report Analyzer (OCR + LLM)
  static async triggerReportAnalysis(fileUrl: string, patientId: string) {
    return axios.post(process.env.N8N_MEDICAL_REPORT_WEBHOOK!, {
      fileUrl,
      patientId,
    });
  }
}
