export type EnquiryField = 'name' | 'phone' | 'email' | 'message';

export type EnquiryFormValues = {
  name: string;
  phone: string;
  email: string;
  message: string;
  whatsappConsent: boolean;
};

export type EnquiryFieldErrors = Partial<Record<EnquiryField, string>>;

const NAME_RE = /^[a-zA-Z\s.'-]{2,60}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s-]{10,17}$/;

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
      if (!NAME_RE.test(trimmed)) {
        return 'Name can only contain letters, spaces, and basic punctuation.';
      }
      return undefined;
    case 'phone': {
      if (!trimmed) return 'Please enter your contact number.';
      if (!PHONE_RE.test(trimmed)) return 'Enter a valid phone number.';
      const digits = trimmed.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        return 'Phone number must be 10–15 digits.';
      }
      return undefined;
    }
    case 'email':
      if (!trimmed) return 'Please enter your email address.';
      if (!EMAIL_RE.test(trimmed)) return 'Enter a valid email address.';
      return undefined;
    case 'message':
      if (options?.requireMessage && !trimmed) return 'Please enter your message.';
      if (trimmed && trimmed.length < 10) {
        return 'Message should be at least 10 characters.';
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
