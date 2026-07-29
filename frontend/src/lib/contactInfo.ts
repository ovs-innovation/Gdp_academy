import type { SiteSettings } from "../services/cmsService";

export const DEFAULT_CONTACT = {
  phone: "+91 78384 16907",
  email: "Gdp.info2019@gmail.com",
  address:
    "K-6, near SANDISH MEDICAL, Sector-12, Block-K, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009",
};

type ContactFields = {
  phone?: string;
  email?: string;
  address?: string;
};

/** Merge site settings + contact page CMS — first non-empty value wins. */
export function resolveContactInfo(
  siteSettings?: Partial<SiteSettings> | null,
  pageContent?: ContactFields | null,
) {
  const pick = (a?: string, b?: string, fallback = "") => {
    const fromA = a?.trim();
    if (fromA) return fromA;
    const fromB = b?.trim();
    if (fromB) return fromB;
    return fallback;
  };

  return {
    phone: pick(siteSettings?.phone, pageContent?.phone, DEFAULT_CONTACT.phone),
    email: pick(siteSettings?.email, pageContent?.email, DEFAULT_CONTACT.email),
    address: pick(siteSettings?.address, pageContent?.address, DEFAULT_CONTACT.address),
  };
}
