import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("✅ Email service ready! (Resend HTTP API)");

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    console.log(`📧 Sending email to: ${options.to}`);

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "HealthNova AI <onboarding@resend.dev>",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error("❌ Email error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Email sent:", data?.id);
    return data;
  } catch (error: any) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
