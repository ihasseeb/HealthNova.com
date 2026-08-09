import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
  },
});

// Verify connection
transporter.verify((error) => {
  if (error) {
    console.log("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service ready! (Resend)");
  }
});

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    console.log(`📧 Sending email to: ${options.to}`);

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error: any) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
