import type { CMSContent } from "../services/cmsService";
import { getLocalizedValue } from "../utils/contentHelper";
import { resolvePublicMediaUrl } from "../utils/mediaUrl";

export type ServiceDetailData = {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  youtubeId?: string;
  stats?: { value: string; label: string }[];
  whyUs?: { title: string; description: string; iconKey: string }[];
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: { num: string; title: string; description: string; image: string }[];
  faq?: { q: string; a: string }[];
};

const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&h=700&q=85";

function resolveServiceImage(cms: CMSContent): string {
  const raw = cms.images?.[0]?.url?.trim();
  if (!raw) return DEFAULT_SERVICE_IMAGE;
  if (raw.startsWith("http") || raw.includes("cloudinary") || raw.startsWith("/uploads/")) {
    return resolvePublicMediaUrl(raw) || raw;
  }
  return DEFAULT_SERVICE_IMAGE;
}

/** Map CMS service entry → service detail page shape */
export function cmsContentToServiceDetail(cms: CMSContent): ServiceDetailData {
  const title = getLocalizedValue(cms.title, "Service");
  const description = getLocalizedValue(cms.description, "");

  let features: string[] = [];
  if (Array.isArray(cms.content?.features)) {
    features = cms.content.features.filter(Boolean);
  } else if (typeof cms.content?.features === "string") {
    features = cms.content.features
      .split(",")
      .map((f: string) => f.trim())
      .filter(Boolean);
  }

  return {
    title,
    tagline:
      cms.content?.tagline ||
      cms.content?.exploreSubtitle ||
      "Garima Dance Productions",
    description:
      description ||
      `Discover ${title} with expert instructors at Garima Dance Productions.`,
    features:
      features.length > 0
        ? features
        : [
            "Expert instruction tailored to your level",
            "Flexible online and in-person options",
            "Supportive, professional training environment",
          ],
    image: resolveServiceImage(cms),
    youtubeId: cms.content?.youtubeId,
  };
}

/** Link target for a CMS / menu service item */
export function servicePageHref(item: {
  key?: string;
  href?: string;
  title?: string;
}): string {
  const href = item.href?.trim();
  if (href?.startsWith("/services/")) return href;
  if (item.key) return `/services/${item.key}`;
  return href || "/contact";
}

export function findCmsServiceBySlug(
  items: CMSContent[],
  slug: string,
): CMSContent | undefined {
  if (!slug) return undefined;
  const lower = slug.toLowerCase();
  return (
    items.find((s) => s.key === slug) ||
    items.find((s) => s.key.toLowerCase() === lower) ||
    items.find((s) => s.key.replace(/-/g, "") === lower.replace(/-/g, ""))
  );
}
