import type { SiteSettings } from "../services/cmsService";

export const DEFAULT_CONTACT = {
  phone: "+91 78384 16907",
  email: "Gdp.info2019@gmail.com",
  address:
    "K-6, near SANDISH MEDICAL, Sector-12, Block-K, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009",
};

const PLACEHOLDER_PHONES = new Set(["+91 98765 43210", "9876543210"]);
const PLACEHOLDER_EMAILS = new Set([
  "hello@gdpstudio.com",
  "hello@gdpacademy.com",
  "info@gdpacademy.com",
]);
const PLACEHOLDER_ADDRESSES = new Set([
  "123 creative rhythm way, dance arts district, new delhi, india",
]);

function isPlaceholder(field: "phone" | "email" | "address", value: string) {
  const v = value.trim();
  if (!v) return true;
  const lower = v.toLowerCase();
  if (field === "phone") {
    const digits = v.replace(/\D/g, "");
    return PLACEHOLDER_PHONES.has(v) || digits === "919876543210";
  }
  if (field === "email") return PLACEHOLDER_EMAILS.has(lower);
  return PLACEHOLDER_ADDRESSES.has(lower);
}

type ContactFields = {
  phone?: string;
  email?: string;
  address?: string;
};

/** Merge site settings + contact page CMS — skip seed placeholders. */
export function resolveContactInfo(
  siteSettings?: Partial<SiteSettings> | null,
  pageContent?: ContactFields | null,
) {
  const pick = (field: "phone" | "email" | "address", a?: string, b?: string) => {
    for (const raw of [a, b]) {
      const v = raw?.trim();
      if (v && !isPlaceholder(field, v)) return v;
    }
    return DEFAULT_CONTACT[field];
  };

  return {
    phone: pick("phone", siteSettings?.phone, pageContent?.phone),
    email: pick("email", siteSettings?.email, pageContent?.email),
    address: pick("address", siteSettings?.address, pageContent?.address),
  };
}
