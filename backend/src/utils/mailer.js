import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are not configured.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

export const sendPasswordResetEmail = async ({ to, name, role, resetToken }) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/forgot-password?token=${encodeURIComponent(resetToken)}&role=${encodeURIComponent(role)}`;
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color:#1c2358;">Justix Password Reset</h2>
      <p>Hello ${name || "User"},</p>
      <p>We received a request to reset your password for your Justix ${role} account.</p>
      <p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#4f6bff;color:#fff;border-radius:8px;text-decoration:none;">
          Reset Password
        </a>
      </p>
      <p>This link is valid for 15 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
      <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb;" />
      <p style="font-size:12px;color:#6b7280;">If the button does not work, copy this link:<br/>${resetLink}</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: "Justix Password Reset",
    html,
  });
};
