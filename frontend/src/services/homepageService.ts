import { API_BASE_URL } from "../lib/apiConfig";
import type { CMSContent, FAQItem, PageContent, SiteSettings } from "./cmsService";
import type { SiteSettings as AppSiteSettings } from "./settingsService";
import type { Testimonial } from "./testimonialService";

export type HomepagePayload = {
  siteSettings: SiteSettings | null;
  appSettings: AppSiteSettings | null;
  services: CMSContent[];
  home: PageContent | null;
  contact: PageContent | null;
  faqs: FAQItem[];
  testimonials: Testimonial[];
};

let inflight: Promise<HomepagePayload> | null = null;

export function getHomepage(): Promise<HomepagePayload> {
  if (inflight) return inflight;
  inflight = fetch(`${API_BASE_URL}/homepage`, {
    headers: { Accept: "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load homepage");
      return response.json() as Promise<HomepagePayload>;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
