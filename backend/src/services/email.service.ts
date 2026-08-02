import nodemailer from "nodemailer";

// Create transporter (email sender configuration)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
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
