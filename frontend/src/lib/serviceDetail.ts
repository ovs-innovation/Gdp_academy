import type { CMSContent } from "../services/cmsService";
import { getLocalizedValue } from "../utils/contentHelper";
import { resolvePublicMediaUrl } from "../utils/mediaUrl";
import { SERVICE_DATA } from "./serviceDetailData";
import {
  getServiceCategory,
  getServiceTheme,
  type ServiceThemeId,
} from "./serviceThemes";

export type ServiceDetailData = {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  gallery?: string[];
  youtubeId?: string;
  heroBadge?: string;
  theme?: ServiceThemeId;
  stats?: { value: string; label: string }[];
  whyUs?: { title: string; description: string; iconKey: string }[];
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: { num: string; title: string; description: string; image: string }[];
  faq?: { q: string; a: string }[];
  ctaLabel?: string;
  bookingTitle?: string;
  bookingDesc?: string;
  finalCtaTitle?: string;
};

const DEFAULT_SERVICE_IMAGE =
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&h=700&q=85";

const WHY_ICONS = ["heart", "video", "users", "smile", "clock", "globe"];

function resolveServiceImage(cms: CMSContent): string {
  const raw = cms.images?.[0]?.url?.trim();
  if (!raw) return DEFAULT_SERVICE_IMAGE;
  if (
    raw.startsWith("http") ||
    raw.includes("cloudinary") ||
    raw.startsWith("/uploads/") ||
    raw.startsWith("/")
  ) {
    return resolvePublicMediaUrl(raw) || raw;
  }
  return DEFAULT_SERVICE_IMAGE;
}

function resolveGallery(cms: CMSContent, heroImage: string): string[] {
  const urls = (cms.images || [])
    .map((img) => resolvePublicMediaUrl(img.url) || img.url)
    .filter(Boolean);
  const unique = [...new Set(urls)];
  if (unique.length === 0) return [heroImage];
  return unique;
}

function parseFeatures(cms: CMSContent): string[] {
  if (Array.isArray(cms.content?.features)) {
    return cms.content.features.filter(Boolean);
  }
  if (typeof cms.content?.features === "string") {
    return cms.content.features
      .split(",")
      .map((f: string) => f.trim())
      .filter(Boolean);
  }
  return [];
}

function featuresToWhyUs(features: string[]) {
  return features.slice(0, 6).map((feature, i) => {
    const words = feature.split(" ");
    const title = words.slice(0, Math.min(4, words.length)).join(" ");
    return {
      title: title.endsWith("…") ? title : `${title}${words.length > 4 ? "…" : ""}`,
      description: feature,
      iconKey: WHY_ICONS[i % WHY_ICONS.length],
    };
  });
}

function buildDefaultProcessSteps(
  slug: string,
  features: string[],
  heroImage: string,
) {
  const theme = getServiceTheme(slug);
  const steps = features.slice(0, 4);
  const titles =
    steps.length >= 4
      ? steps
      : [
          "Discovery & Goal Setting",
          "Personalised Program Design",
          "Guided Sessions & Practice",
          "Progress & Performance",
        ];

  return titles.map((title, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: title.length > 48 ? `${title.slice(0, 45)}…` : title,
    description:
      i === 0
        ? `We understand your goals for ${slug.replace(/-/g, " ")} and map a clear learning path.`
        : i === 1
          ? "Our instructors design routines and sessions tailored to your level and schedule."
          : i === 2
            ? "Live or guided practice with corrections, feedback, and structured milestones."
            : "Celebrate progress with confidence — ready for stage, events, or daily practice.",
    image: theme.processImages[i] || heroImage,
  }));
}

function isNonEmpty<T>(value: T | undefined | null): value is T {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

/** CMS → partial detail (admin-editable fields) */
export function cmsContentToServiceDetail(cms: CMSContent): ServiceDetailData {
  const title = getLocalizedValue(cms.title, "Service");
  const description = getLocalizedValue(cms.description, "");
  const features = parseFeatures(cms);
  const image = resolveServiceImage(cms);
  const c = cms.content || {};

  return {
    title,
    tagline: c.tagline || c.exploreSubtitle || "",
    description,
    features,
    image,
    gallery: resolveGallery(cms, image),
    youtubeId: c.youtubeId,
    heroBadge: c.heroBadge,
    theme: c.theme as ServiceThemeId | undefined,
    stats: Array.isArray(c.stats) ? c.stats : undefined,
    whyUs: Array.isArray(c.whyUs) ? c.whyUs : undefined,
    processTitle: c.processTitle,
    processSubtitle: c.processSubtitle,
    processSteps: Array.isArray(c.processSteps) ? c.processSteps : undefined,
    faq: Array.isArray(c.faq) ? c.faq : undefined,
    ctaLabel: c.ctaLabel,
    bookingTitle: c.bookingTitle,
    bookingDesc: c.bookingDesc,
  };
}

/** Merge CMS overrides on top of defaults, then enrich per-service theme/content */
export function buildServiceDetail(
  slug: string,
  cmsPartial: ServiceDetailData | null,
  hardcoded?: ServiceDetailData,
): ServiceDetailData {
  const category = getServiceCategory(slug);
  const theme = getServiceTheme(slug, cmsPartial?.theme || hardcoded?.theme);

  const base: ServiceDetailData = {
    title: hardcoded?.title || cmsPartial?.title || slug.replace(/-/g, " "),
    tagline: hardcoded?.tagline || cmsPartial?.tagline || theme.heroBadge,
    description:
      hardcoded?.description ||
      cmsPartial?.description ||
      `Discover expert-led ${slug.replace(/-/g, " ")} with Garima Dance Productions.`,
    features:
      (cmsPartial?.features?.length ? cmsPartial.features : hardcoded?.features) || [],
    image: cmsPartial?.image || hardcoded?.image || DEFAULT_SERVICE_IMAGE,
    gallery:
      cmsPartial?.gallery ||
      hardcoded?.gallery ||
      [cmsPartial?.image || hardcoded?.image || DEFAULT_SERVICE_IMAGE],
    youtubeId: cmsPartial?.youtubeId ?? hardcoded?.youtubeId,
    heroBadge: cmsPartial?.heroBadge || hardcoded?.heroBadge || theme.heroBadge,
    theme: cmsPartial?.theme || hardcoded?.theme || category,
    stats: isNonEmpty(cmsPartial?.stats)
      ? cmsPartial!.stats
      : hardcoded?.stats || theme.defaultStats,
    whyUs: isNonEmpty(cmsPartial?.whyUs)
      ? cmsPartial!.whyUs
      : hardcoded?.whyUs,
    processTitle:
      cmsPartial?.processTitle || hardcoded?.processTitle || theme.processTitle,
    processSubtitle:
      cmsPartial?.processSubtitle ||
      hardcoded?.processSubtitle ||
      theme.processSubtitle,
    processSteps: isNonEmpty(cmsPartial?.processSteps)
      ? cmsPartial!.processSteps
      : hardcoded?.processSteps,
    faq: isNonEmpty(cmsPartial?.faq) ? cmsPartial!.faq : hardcoded?.faq || theme.defaultFaq,
    ctaLabel: cmsPartial?.ctaLabel || hardcoded?.ctaLabel || theme.ctaLabel,
    bookingTitle:
      cmsPartial?.bookingTitle || hardcoded?.bookingTitle || theme.bookingTitle,
    bookingDesc: cmsPartial?.bookingDesc || hardcoded?.bookingDesc || theme.bookingDesc,
    finalCtaTitle:
      hardcoded?.finalCtaTitle || theme.finalCtaTitle,
  };

  if (!base.features.length) {
    base.features = [
      "Expert instruction tailored to your level",
      "Flexible online and in-person options",
      "Supportive, professional training environment",
    ];
  }

  if (!base.whyUs?.length) {
    base.whyUs = featuresToWhyUs(base.features);
  }

  if (!base.processSteps?.length) {
    base.processSteps = buildDefaultProcessSteps(slug, base.features, base.image);
  }

  if (!base.gallery?.length) {
    base.gallery = [base.image];
  }

  return base;
}

export function getHardcodedService(slug: string): ServiceDetailData | undefined {
  return SERVICE_DATA[slug];
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
