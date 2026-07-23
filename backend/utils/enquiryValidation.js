/**
 * Shared strict validation for enquiry / contact form payloads.
 */

const NAME_RE = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\d{10}$/;

const MAX_NAME = 60;
const MAX_EMAIL = 100;
const MAX_MESSAGE = 500;
const MIN_MESSAGE = 10;

const validateLeadFields = ({ name, email, phone, message, requireMessage = true }) => {
  const errors = [];

  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPhone = String(phone || "").trim();
  const cleanMessage = String(message || "").trim();

  if (!cleanName) errors.push("Name is required");
  else if (cleanName.length < 2 || cleanName.length > MAX_NAME) {
    errors.push("Name must be 2–60 characters");
  } else if (!NAME_RE.test(cleanName)) {
    errors.push("Name can only contain letters and spaces");
  }

  if (!cleanEmail) errors.push("Email is required");
  else if (cleanEmail.length > MAX_EMAIL || !EMAIL_RE.test(cleanEmail)) {
    errors.push("Invalid email address");
  }

  if (!cleanPhone) errors.push("Phone is required");
  else if (!PHONE_RE.test(cleanPhone)) {
    errors.push("Phone must be a 10-digit number");
  } else if (!/^[6-9]/.test(cleanPhone)) {
    errors.push("Mobile number must start with 6, 7, 8, or 9");
  }

  if (requireMessage && !cleanMessage) errors.push("Message is required");
  else if (cleanMessage && cleanMessage.length < MIN_MESSAGE) {
    errors.push(`Message must be at least ${MIN_MESSAGE} characters`);
  } else if (cleanMessage.length > MAX_MESSAGE) {
    errors.push(`Message cannot exceed ${MAX_MESSAGE} characters`);
  } else if (cleanMessage && /[<>]/.test(cleanMessage)) {
    errors.push("Message contains invalid characters");
  }

  return {
    ok: errors.length === 0,
    errors,
    values: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
    },
  };
};

module.exports = { validateLeadFields };
