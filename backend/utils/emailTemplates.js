/** Minimal branded HTML emails — dark theme + GDP logo */

const fs = require("fs");
const path = require("path");

const LOGO_CID = "gdp-logo";

const escapeHtml = (value) => {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const formatDateTime = (date = new Date()) =>
  date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

const getLogoAttachment = () => {
  const candidates = [
    path.join(__dirname, "..", "assets", "logo.png"),
    path.join(__dirname, "..", "..", "frontend", "public", "logo.png"),
    path.join(__dirname, "..", "..", "admin", "public", "logo.png"),
  ];
  const logoPath = candidates.find((p) => fs.existsSync(p));
  if (!logoPath) return null;
  return {
    filename: "logo.png",
    path: logoPath,
    cid: LOGO_CID,
  };
};

const normalizeLeadMessage = (message) => {
  const msg = (message || "").trim();
  if (!msg) return null;

  const onlyBoilerplate =
    /^Homepage Let's Catch up enquiry\.\s*WhatsApp consent:\s*(Yes|No)\.?$/i.test(msg);
  if (onlyBoilerplate) return null;

  return msg
    .replace(/\s*WhatsApp consent:\s*(Yes|No)\.?\s*$/i, "")
    .replace(/^Homepage Let's Catch up enquiry\.\s*/i, "")
    .trim() || null;
};

const fieldRow = (label, value, { link } = {}) => {
  const safe = escapeHtml(value || "—");
  const valueHtml = link
    ? `<a href="mailto:${safe}" style="color:#a78bfa;text-decoration:none;font-weight:600;">${safe}</a>`
    : `<span style="color:#f1f5f9;font-weight:600;">${safe}</span>`;

  return `
    <tr>
      <td style="padding:10px 0;font-size:12px;color:#94a3b8;width:72px;vertical-align:top;text-transform:uppercase;letter-spacing:0.05em;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;font-size:15px;line-height:1.45;">${valueHtml}</td>
    </tr>`;
};

const buildAdminLeadEmail = ({ name, email, phone, message, whatsappConsent }) => {
  const hasLogo = Boolean(getLogoAttachment());
  const displayMessage = normalizeLeadMessage(message);

  const rows = [
    fieldRow("Name", name),
    fieldRow("Email", email, { link: "email" }),
    fieldRow("Phone", phone),
  ];

  if (whatsappConsent === true) {
    rows.push(
      fieldRow("WhatsApp consent", "Agreed to receive enquiry replies on WhatsApp"),
    );
  }

  const messageBlock = displayMessage
    ? `
      <tr>
        <td colspan="2" style="padding:16px 0 4px 0;">
          <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
          <p style="margin:0;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:14px 16px;font-size:15px;line-height:1.6;color:#e8ecf4;white-space:pre-wrap;">${escapeHtml(displayMessage)}</p>
        </td>
      </tr>`
    : "";

  const logoBlock = hasLogo
    ? `<img src="cid:${LOGO_CID}" alt="Garima Dance Productions" width="88" height="auto" style="display:block;margin:0 auto 12px auto;border:0;" />`
    : `<p style="margin:0 0 8px 0;font-size:18px;font-weight:800;color:#a78bfa;">GDP Studio</p>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" bgcolor="#252532" style="max-width:480px;width:100%;background:linear-gradient(160deg,#2a2a38 0%,#1f1f2b 100%);border-radius:16px;border:1px solid #4a4a5e;overflow:hidden;box-shadow:0 12px 40px rgba(15,15,25,0.18);">
        <tr>
          <td style="padding:28px 24px 8px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);">
            ${logoBlock}
            <p style="margin:0;font-size:12px;color:#9ca3af;">${formatDateTime()}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px 24px 24px;">
            <p style="margin:0 0 16px 0;font-size:17px;font-weight:700;color:#f8fafc;">New enquiry from ${escapeHtml(name)}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              ${rows.join("")}
              ${messageBlock}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 24px;background:rgba(0,0,0,0.15);text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid rgba(255,255,255,0.08);">
            Garima Dance Productions · Automated notification
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

const buildCustomerThankYouEmail = ({ name }) => {
  const hasLogo = Boolean(getLogoAttachment());
  const logoBlock = hasLogo
    ? `<img src="cid:${LOGO_CID}" alt="GDP Studio" width="80" style="display:block;margin:0 auto 16px auto;border:0;" />`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" style="padding:32px 16px;background:#ffffff;">
    <tr><td align="center">
      <table role="presentation" bgcolor="#252532" style="max-width:480px;width:100%;background:linear-gradient(160deg,#2a2a38 0%,#1f1f2b 100%);border-radius:16px;border:1px solid #4a4a5e;box-shadow:0 12px 40px rgba(15,15,25,0.18);">
        <tr>
          <td style="padding:32px 28px;text-align:center;">
            ${logoBlock}
            <h1 style="margin:0 0 12px 0;font-size:20px;color:#ffffff;">Thank you, ${escapeHtml(name)}!</h1>
            <p style="margin:0;font-size:15px;line-height:1.65;color:#94a3b8;">
              We received your message and will reply within <strong style="color:#c4b5fd;">24–48 hours</strong>.
            </p>
            <p style="margin:20px 0 0 0;font-size:13px;color:#64748b;">— GDP Studio Team</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

const withLogoAttachment = (mailOptions) => {
  const logo = getLogoAttachment();
  if (logo) {
    mailOptions.attachments = [...(mailOptions.attachments || []), logo];
  }
  return mailOptions;
};

const getAdminPanelUrl = () =>
  process.env.ADMIN_URL || process.env.ADMIN_PANEL_URL || "http://localhost:8080";

module.exports = {
  escapeHtml,
  formatDateTime,
  normalizeLeadMessage,
  buildAdminLeadEmail,
  buildCustomerThankYouEmail,
  withLogoAttachment,
  getAdminPanelUrl,
};
