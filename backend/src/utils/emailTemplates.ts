import { env } from "../config/env";

const layout = (content: string): string => {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <div style="background: #1E40AF; padding: 16px 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 22px;">TaskFlow Pro</h1>
      </div>
      <div style="background: #f9fafb; padding: 32px 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        ${content}
      </div>
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
        If you did not request this email, you can safely ignore it.
      </p>
    </div>`;
};

export const verifyEmailTemplate = (name: string, token: string): string => {
    const link = `${env.API_URL}/api/v1/auth/verify-email/${token}`;
    return layout(`
        <h2 style="color: #1f2937;">Hi ${name}, verify your email</h2>
        <p style="color: #4b5563;">Thanks for signing up. Click the button below to verify your email address.</p>
        <a href="${link}" style="display:inline-block; background:#1E40AF; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin: 16px 0;">
            Verify Email
        </a>
        <p style="color: #9ca3af; font-size: 13px;">This link expires in 24 hours.</p>
        `);
};

export const resetpasswordTemplate = (name: string, token: string): string => {
    const link = `${env.APP_URL}/reset-password/${token}`;
    return layout(`
    <h2 style="color: #1f2937;">Hi ${name}, reset your password</h2>
    <p style="color: #4b5563;">We received a request to reset your password. Click below to choose a new one.</p>
    <a href="${link}" style="display:inline-block; background:#1E40AF; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin: 16px 0;">
        Reset Password
    </a>
    <p style="color: #9ca3af; font-size: 13px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
  `);
};

export const inviteEmailTemplate = (inviterName: string, orgName: string, token: string): string => {
    const link = `${env.APP_URL}/invite/${token}`;
    return layout(`
    <h2 style="color: #1f2937;">${inviterName} invited you to join ${orgName}</h2>
    <p style="color: #4b5563;">You've been invited to collaborate on TaskFlow Pro. Accept the invite to get started.</p>
    <a href="${link}" style="display:inline-block; background:#1E40AF; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold; margin: 16px 0;">
        Accept Invite
    </a>
    <p style="color: #9ca3af; font-size: 13px;">This invite expires in 48 hours.</p>
  `);
};
