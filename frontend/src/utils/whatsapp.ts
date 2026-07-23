export const DEFAULT_WHATSAPP_MESSAGE =
  "Hello! I found Garima Dance Productions through your website. I'm interested in your dance classes. Please share the available batches, fees, timings, and other details.";

export function buildWhatsAppUrl(
  phone: string,
  message: string = DEFAULT_WHATSAPP_MESSAGE,
): string {
  const digits = phone.replace(/\D/g, "");
  const text = encodeURIComponent(message);
  if (!digits) return `https://wa.me/?text=${text}`;
  return `https://wa.me/${digits}?text=${text}`;
}
