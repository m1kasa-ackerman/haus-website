import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set.');
  _resend = new Resend(key);
  return _resend;
}

export const isResendConfigured = () =>
  Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_TO_EMAIL);

interface InquiryEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType?: string | null;
  message?: string | null;
}

export async function sendInquiryEmail(data: InquiryEmailData) {
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!to) throw new Error('INQUIRY_TO_EMAIL is not set.');

  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const html = `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;background:#f0ebe3;border-radius:14px;overflow:hidden">
      <div style="background:#1a1f36;padding:28px 32px">
        <div style="color:#f0ebe3;font-size:22px;font-weight:700;letter-spacing:-0.02em">Haus <span style="font-size:10px;letter-spacing:0.2em;color:#c9a050;text-transform:uppercase">Design Studio</span></div>
        <div style="color:#c9a050;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;margin-top:6px">New project inquiry</div>
      </div>
      <div style="padding:32px">
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1a1a2e">
          <tr><td style="padding:8px 0;color:#7a7068;width:120px;text-transform:uppercase;font-size:11px;letter-spacing:0.1em">Name</td><td style="padding:8px 0;font-weight:600">${escapeHtml(fullName)}</td></tr>
          <tr><td style="padding:8px 0;color:#7a7068;text-transform:uppercase;font-size:11px;letter-spacing:0.1em">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(data.email)}" style="color:#8b5e3c">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#7a7068;text-transform:uppercase;font-size:11px;letter-spacing:0.1em">Phone</td><td style="padding:8px 0"><a href="tel:${escapeHtml(data.phone)}" style="color:#8b5e3c">${escapeHtml(data.phone)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#7a7068;text-transform:uppercase;font-size:11px;letter-spacing:0.1em">Project</td><td style="padding:8px 0">${escapeHtml(data.projectType || '—')}</td></tr>
        </table>
        ${
          data.message
            ? `<div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(26,31,54,0.1)">
                 <div style="color:#7a7068;text-transform:uppercase;font-size:11px;letter-spacing:0.1em;margin-bottom:8px">Message</div>
                 <div style="font-size:14px;line-height:1.7;color:#1a1a2e;white-space:pre-wrap">${escapeHtml(data.message)}</div>
               </div>`
            : ''
        }
        <div style="margin-top:24px;font-size:12px;color:#7a7068">Reply directly to this email to reach ${escapeHtml(fullName)}.</div>
      </div>
    </div>`;

  return getResend().emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `New inquiry — ${fullName}${data.projectType ? ` (${data.projectType})` : ''}`,
    html
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
