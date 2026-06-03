const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const getEmailPass = () =>
  (process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

const getEmailUser = () => (process.env.EMAIL_USER || "").trim().toLowerCase();

const getAdminEmail = () =>
  (process.env.ADMIN_EMAIL || getEmailUser()).trim().toLowerCase();

const createAppPasswordTransport = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || "true") !== "false",
    auth: {
      user: getEmailUser(),
      pass: getEmailPass(),
    },
  });

const createOAuthTransport = () => {
  const { OAuth2Client } = require("google-auth-library");
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Gmail OAuth env vars missing");
  }

  const oauth2Client = new OAuth2Client(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: getEmailUser(),
      clientId,
      clientSecret,
      refreshToken,
    },
  });
};

const verifyTransport = (transport) =>
  new Promise((resolve, reject) => {
    transport.verify((err) => (err ? reject(err) : resolve()));
  });

let transporter = null;
let emailReady = false;

const initEmailTransport = async () => {
  const user = getEmailUser();
  if (!user) {
    console.log("📧 Email: EMAIL_USER not set in backend/.env");
    return { ready: false };
  }

  console.log(`📧 Email sender: ${user} | Admin inbox: ${getAdminEmail()}`);

  if (process.env.GMAIL_REFRESH_TOKEN) {
    try {
      const oauthTransport = createOAuthTransport();
      await verifyTransport(oauthTransport);
      transporter = oauthTransport;
      emailReady = true;
      console.log(`✅ Email ready (Gmail OAuth) — messages go to ${getAdminEmail()}`);
      return { ready: true, mode: "oauth" };
    } catch (err) {
      console.warn("⚠️  Gmail OAuth failed:", err.message);
    }
  }

  if (!getEmailPass()) {
    console.warn("⚠️  EMAIL_PASS missing — add Gmail App Password or run npm run email:oauth-setup");
    return { ready: false };
  }

  try {
    const smtpTransport = createAppPasswordTransport();
    await verifyTransport(smtpTransport);
    transporter = smtpTransport;
    emailReady = true;
    console.log(`✅ Email ready — OTP & notifications → ${getAdminEmail()} inbox`);
    return { ready: true, mode: "app_password" };
  } catch (err) {
    emailReady = false;
    transporter = null;
    console.warn("⚠️  Gmail login failed (app password not accepted by Google).");
    console.warn("   Fix A: New App Password → https://myaccount.google.com/apppasswords");
    console.warn("        (login as dristyy13@gmail.com, 2-Step ON, create password, update EMAIL_PASS)");
    console.warn("   Fix B: One-time OAuth → npm run email:oauth-setup");
    return { ready: false, error: err.message };
  }
};

const getTransport = () => {
  if (!emailReady || !transporter) {
    throw new Error(
      "Email not configured. Add valid Gmail App Password for dristyy13@gmail.com in backend/.env",
    );
  }
  return transporter;
};

const isEmailReady = () => emailReady;

module.exports = {
  initEmailTransport,
  getTransport,
  isEmailReady,
  getEmailUser,
  getAdminEmail,
  canSendEmail: () => Boolean(getEmailUser() && (getEmailPass() || process.env.GMAIL_REFRESH_TOKEN)),
};
