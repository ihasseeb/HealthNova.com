import nodemailer from "nodemailer";

// Create transporter (email sender configuration)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // ← 465 (SSL) for Railway
  secure: true, // ← MUST be true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.log("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service ready to send messages");
  }
});

// Email options interface
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Send Email Function
export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error: any) {
    console.error("❌ Email sending failed:", error.message);
    throw new Error("Failed to send email");
  }
};
