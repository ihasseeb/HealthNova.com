// Welcome Email Template
export const welcomeEmailTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 40px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px; color: #334155; }
        .content h2 { color: #10b981; }
        .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💚 Welcome to HealthNova AI!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name}! 👋</h2>
          <p>Welcome to <strong>HealthNova AI</strong> - your personal AI health companion!</p>
          <p>We're thrilled to have you on board. You now have access to:</p>
          <ul>
            <li>🧠 AI-powered symptom checker</li>
            <li>🥗 Personalized diet plans</li>
            <li>💪 Custom workout routines</li>
            <li>👨‍⚕️ Expert consultations</li>
            <li>📊 Health tracking dashboard</li>
          </ul>
          <p>Start your health journey today!</p>
          <center>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
          </center>
          <p>If you have any questions, feel free to reach out to us!</p>
          <p>Stay healthy,<br><strong>The HealthNova AI Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2026 HealthNova AI. All rights reserved.</p>
          <p>You received this email because you signed up on HealthNova AI.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Forgot Password Email Template
export const forgotPasswordEmailTemplate = (
  name: string,
  resetLink: string,
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 40px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px; color: #334155; }
        .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password for your HealthNova AI account.</p>
          <p>Click the button below to reset your password:</p>
          <center>
            <a href="${resetLink}" class="button">Reset Password</a>
          </center>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #10b981;">${resetLink}</p>
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in <strong>15 minutes</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password will remain unchanged until you use this link</li>
            </ul>
          </div>
          <p>Stay safe,<br><strong>The HealthNova AI Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2026 HealthNova AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email Verification Template
export const verificationEmailTemplate = (
  name: string,
  verificationLink: string,
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 40px; text-align: center; color: white; }
        .content { padding: 40px; color: #334155; }
        .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #10b981, #06b6d4); color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
          <center>
            <a href="${verificationLink}" class="button">Verify Email</a>
          </center>
          <p>Or copy this link: <br><span style="color: #10b981;">${verificationLink}</span></p>
          <p><small>This link expires in 24 hours.</small></p>
        </div>
        <div class="footer">
          <p>© 2026 HealthNova AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// OTP Verification Email Template
export const otpEmailTemplate = (name: string, otp: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); padding: 40px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { padding: 40px; color: #334155; text-align: center; }
        .otp-box { background: linear-gradient(135deg, #f0fdfa, #ecfeff); border: 2px dashed #10b981; padding: 30px; border-radius: 12px; margin: 30px 0; }
        .otp-code { font-size: 42px; font-weight: bold; color: #10b981; letter-spacing: 12px; margin: 10px 0; font-family: 'Courier New', monospace; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; text-align: left; }
        .footer { padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Hi ${name}! 👋</h2>
          <p>Thanks for signing up on <strong>HealthNova AI</strong>!</p>
          <p>Please use the OTP below to verify your email address:</p>
          
          <div class="otp-box">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Your OTP Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 0; color: #64748b; font-size: 12px;">Valid for 10 minutes</p>
          </div>

          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 10px 0;">
              <li>Never share this code with anyone</li>
              <li>Our team will never ask for your OTP</li>
              <li>Code expires in 10 minutes</li>
            </ul>
          </div>

          <p>If you didn't create an account, please ignore this email.</p>
          
          <p style="margin-top: 30px;">Stay healthy,<br><strong>The HealthNova AI Team</strong></p>
        </div>
        <div class="footer">
          <p>© 2026 HealthNova AI. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
