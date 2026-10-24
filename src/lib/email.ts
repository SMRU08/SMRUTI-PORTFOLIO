import { Resend } from "resend";
import type { ContactInput } from "@/lib/contact-schema";

let resendClient: Resend | null = null;

function getClient() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    resendClient = new Resend(key);
  }
  return resendClient;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(input: ContactInput) {
  const to = process.env.CONTACT_TO_EMAIL || "smrutiranjan2412@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
      <h2 style="color: #0284c7; margin-top: 0; border-bottom: 2px solid #e0f2fe; padding-bottom: 12px; font-size: 20px;">
        💼 New Portfolio Job Inquiry / Message
      </h2>
      <p style="font-size: 15px; line-height: 1.6; margin: 16px 0; color: #334155;">
        You received a new message from a visitor / recruiter on your portfolio website:
      </p>
      <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 18px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; font-size: 15px;"><strong>Sender Name:</strong> ${escapeHtml(input.name)}</p>
        <p style="margin: 0; font-size: 15px;"><strong>Sender Email:</strong> <a href="mailto:${escapeHtml(input.email)}" style="color: #0284c7; text-decoration: underline;">${escapeHtml(input.email)}</a></p>
      </div>
      <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 24px; margin-bottom: 8px;">
        Message Content:
      </p>
      <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.7; white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #0f172a; border: 1px solid #e2e8f0;">
${escapeHtml(input.message)}
      </div>
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center;">
        Delivered to <strong>${escapeHtml(to)}</strong> from your Portfolio Contact Form.<br/>
        Click &quot;Reply&quot; in your email client to reply directly to ${escapeHtml(input.name)} (${escapeHtml(input.email)}).
      </div>
    </div>
  `;

  const text = `New Portfolio Job Inquiry / Message\n\nFrom: ${input.name} <${input.email}>\nDelivered To: ${to}\nReply-To: ${input.email}\n\nMessage:\n${input.message}\n`;

  const result = await getClient().emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `💼 New Inquiry from ${input.name} — Portfolio Message`,
    html,
    text,
  });

  if (result.error) {
    throw new Error(result.error.message ?? "Email send failed");
  }
  return result.data;
}
