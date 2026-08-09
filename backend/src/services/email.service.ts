import nodemailer from "nodemailer";
import dns from "dns";

// Force IPv4 for entire process
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
  // Force IPv4 connection
  family: 4,
  // Additional connection options
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
} as any);

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.log("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service ready! (Gmail SMTP)");
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
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
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
