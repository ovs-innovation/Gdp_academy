export type EnquiryField = 'name' | 'phone' | 'email' | 'message';

export type EnquiryFormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
  whatsappConsent: boolean;
};

export type EnquiryFieldErrors = Partial<Record<EnquiryField, string>>;

/** Letters and spaces only — e.g. "Garima Singh" */
const NAME_RE = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_RE = /^\d{10}$/;

const MAX_NAME = 60;
const MAX_EMAIL = 100;
const MAX_PHONE = 10;
const MAX_MESSAGE = 500;
const MIN_MESSAGE = 10;

export function sanitizeEnquiryField(field: EnquiryField, value: string): string {
  switch (field) {
    case 'name':
      return value
        .replace(/[^A-Za-z\s]/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, MAX_NAME);
    case 'phone':
      return value.replace(/\D/g, '').slice(0, MAX_PHONE);
    case 'email':
      return value.replace(/\s/g, '').slice(0, MAX_EMAIL);
    case 'message':
      return value.replace(/[<>]/g, '').slice(0, MAX_MESSAGE);
    default:
      return value;
  }
}

export function validateEnquiryField(
  field: EnquiryField,
  value: string,
  options?: { requireMessage?: boolean },
): string | undefined {
  const trimmed = value.trim();

  switch (field) {
    case 'name':
      if (!trimmed) return 'Please enter your full name.';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      if (trimmed.length > MAX_NAME) return `Name cannot exceed ${MAX_NAME} characters.`;
      if (!NAME_RE.test(trimmed)) {
        return 'Name can only contain letters (A–Z) and spaces.';
      }
      return undefined;
    case 'phone':
      if (!trimmed) return 'Please enter your contact number.';
      if (!PHONE_RE.test(trimmed)) {
        return 'Enter a valid 10-digit mobile number (digits only).';
      }
      if (!/^[6-9]/.test(trimmed)) {
        return 'Mobile number must start with 6, 7, 8, or 9.';
      }
      return undefined;
    case 'email':
      if (!trimmed) return 'Please enter your email address.';
      if (trimmed.length > MAX_EMAIL) return 'Email is too long.';
      if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address.';
      return undefined;
    case 'message':
      if (options?.requireMessage && !trimmed) return 'Please enter your message.';
      if (trimmed && trimmed.length < MIN_MESSAGE) {
        return `Message must be at least ${MIN_MESSAGE} characters.`;
      }
      if (trimmed.length > MAX_MESSAGE) {
        return `Message cannot exceed ${MAX_MESSAGE} characters.`;
      }
      if (trimmed && /[<>]/.test(trimmed)) {
        return 'Message contains invalid characters.';
      }
      return undefined;
    default:
      return undefined;
  }
}

export function validateEnquiryForm(
  values: Pick<EnquiryFormValues, EnquiryField>,
  options?: { requireMessage?: boolean },
): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};

  (['name', 'phone', 'email', 'message'] as EnquiryField[]).forEach((field) => {
    const error = validateEnquiryField(field, values[field], options);
    if (error) errors[field] = error;
  });

  return errors;
}

export function hasEnquiryErrors(errors: EnquiryFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
