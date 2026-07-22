/** Admin mirror — keep in sync with frontend/src/lib/workshopsPageCms.ts */

export type WorkshopValueBlock = {
  eyebrow: string;
  title: string;
};

export type WorkshopTestimonial = {
  name: string;
  role: string;
  quote: string;
};

export type WorkshopStat = {
  value: string;
  label: string;
};

export type WorkshopsPageContent = {
  offerBannerText: string;
  showCountdown: boolean;
  countdownEnd: string;
  tabFreeLabel: string;
  tabVideosLabel: string;
  featuredLabel: string;
  featuredTitle: string;
  featuredBadges: string[];
  featuredDescription: string;
  featuredPerks: string[];
  featuredImage: string;
  featuredPrice: string;
  featuredOriginalPrice: string;
  featuredDiscount: string;
  ctaText: string;
  ctaLink: string;
  socialProofStars: string;
  socialProofReviews: string;
  trustedByText: string;
  valuesSectionTitle: string;
  valuesSectionHighlight: string;
  valueBlocks: WorkshopValueBlock[];
  testimonialsHeading: string;
  testimonialsSubheading: string;
  trustTitle: string;
  testimonials: WorkshopTestimonial[];
  aboutLabel: string;
  aboutTitle: string;
  instituteName: string;
  instituteTags: string[];
  aboutText: string;
  aboutStats: WorkshopStat[];
  listSectionTitle: string;
  listSectionHighlight: string;
  listSectionSubtitle: string;
};

export const DEFAULT_WORKSHOPS_PAGE: WorkshopsPageContent = {
  offerBannerText: "Hurry up! Offer for limited period only",
  showCountdown: true,
  countdownEnd: "",
  tabFreeLabel: "FREE CONTENT",
  tabVideosLabel: "VIDEOS",
  featuredLabel: "Featured Workshop",
  featuredTitle: "Bollywood & Wedding Choreography Masterclass 2026",
  featuredBadges: ["Lifetime Access", "Course Certificate", "Live Sessions"],
  featuredDescription:
    "Master Bollywood routines, wedding sangeet choreography, and stage presence with GDP mentors. Perfect for beginners and performers preparing for their big day.",
  featuredPerks: [
    "Live interactive Zoom sessions",
    "Lifetime recorded access",
    "Certificate of completion",
    "Choreography notes & music pack",
    "WhatsApp mentor support",
    "Performance showcase opportunity",
  ],
  featuredImage:
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&h=700&q=80",
  featuredPrice: "₹999",
  featuredOriginalPrice: "₹1,999",
  featuredDiscount: "50%",
  ctaText: "BUY NOW",
  ctaLink: "/contact?source=workshop-featured",
  socialProofStars: "5.0",
  socialProofReviews: "500+ Verified Reviews",
  trustedByText: "Trusted By 2,500+ Students",
  valuesSectionTitle: "Why join",
  valuesSectionHighlight: "GDP workshops",
  valueBlocks: [
    { eyebrow: "Become Stage Ready", title: "Start for Only ₹999" },
    { eyebrow: "2,500+ Students Joined", title: "Now It Is Your Turn" },
    { eyebrow: "Zero to Stage Roadmap", title: "Learn Online or In Studio" },
    { eyebrow: "Wedding to Showcase", title: "Perform With Confidence" },
    { eyebrow: "₹20,000+ Value Pack", title: "ONLY ₹999" },
  ],
  testimonialsHeading: "How This Workshop Changed Their Journey",
  testimonialsSubheading: "REVIEWS",
  trustTitle: "Why trust us?",
  testimonials: [
    {
      name: "Priya Sharma",
      role: "Wedding Client",
      quote:
        "GDP made our sangeet performance feel effortless — from zero dance background to confident stage presence.",
    },
    {
      name: "Arjun Mehta",
      role: "Online Student",
      quote:
        "Live Zoom workshops feel just like an in-studio class. Lifetime recordings make it an excellent investment.",
    },
    {
      name: "Neha Kapoor",
      role: "Fitness Batch",
      quote:
        "The Bollywood fitness workshop improved both my energy and flexibility. Highly recommend GDP.",
    },
    {
      name: "Rohan Verma",
      role: "Stage Performer",
      quote:
        "Clear choreography, patient mentors, and practical feedback. I felt ready for the stage within weeks.",
    },
  ],
  aboutLabel: "About",
  aboutTitle: "Our Studio",
  instituteName: "Garima Dance Productions",
  instituteTags: [
    "Dance Training & Performance",
    "Wedding Choreography Experts",
    "15+ years experience",
  ],
  aboutText:
    "Welcome to Garima Dance Productions — a modern dance studio built to help students and performers grow with real stage-ready skills. We believe in learning by doing through practical workshops, live mentorship, and performance-focused training.",
  aboutStats: [
    { value: "15+", label: "Years" },
    { value: "700+", label: "Weddings" },
    { value: "50K+", label: "Students" },
  ],
  listSectionTitle: "Upcoming",
  listSectionHighlight: "Workshops",
  listSectionSubtitle: "Book your spot in our next live intensives",
};

const asString = (v: unknown, fallback: string) =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

const asBool = (v: unknown, fallback: boolean) =>
  typeof v === "boolean" ? v : fallback;

const asStringArray = (v: unknown, fallback: string[]): string[] => {
  if (Array.isArray(v)) {
    return v.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof v === "string" && v.trim()) {
    return v.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  return fallback;
};

/** Merge saved CMS data with defaults so empty fields never break the live page. */
export function mergeWorkshopsPageContent(
  raw: Record<string, unknown> = {},
): WorkshopsPageContent {
  const d = DEFAULT_WORKSHOPS_PAGE;
  const valueSource = raw.valueBlocks ?? raw.highlightCards;

  const valueBlocks = Array.isArray(valueSource)
    ? (valueSource as WorkshopValueBlock[])
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const o = item as Record<string, unknown>;
          const eyebrow = asString(o.eyebrow, asString(o.subtitle, ""));
          const title = asString(o.title, "");
          if (!title && !eyebrow) return null;
          if (!o.eyebrow && o.subtitle) {
            return { eyebrow: asString(o.subtitle, ""), title };
          }
          return { eyebrow: eyebrow || title, title: title || eyebrow };
        })
        .filter(Boolean) as WorkshopValueBlock[]
    : d.valueBlocks;

  const testimonials = Array.isArray(raw.testimonials)
    ? (raw.testimonials as WorkshopTestimonial[])
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const name = asString((item as WorkshopTestimonial).name, "");
          const quote = asString((item as WorkshopTestimonial).quote, "");
          if (!name || !quote) return null;
          return {
            name,
            role: asString((item as WorkshopTestimonial).role, "GDP Student"),
            quote,
          };
        })
        .filter(Boolean) as WorkshopTestimonial[]
    : d.testimonials;

  const aboutStats = Array.isArray(raw.aboutStats)
    ? (raw.aboutStats as WorkshopStat[])
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const value = asString(item.value, "");
          const label = asString(item.label, "");
          if (!value || !label) return null;
          return { value, label };
        })
        .filter(Boolean) as WorkshopStat[]
    : d.aboutStats;

  return {
    offerBannerText: asString(raw.offerBannerText, d.offerBannerText),
    showCountdown: asBool(raw.showCountdown, d.showCountdown),
    countdownEnd: asString(raw.countdownEnd, d.countdownEnd),
    tabFreeLabel: asString(raw.tabFreeLabel, d.tabFreeLabel),
    tabVideosLabel: asString(raw.tabVideosLabel, d.tabVideosLabel),
    featuredLabel: asString(raw.featuredLabel, d.featuredLabel),
    featuredTitle: asString(raw.featuredTitle, d.featuredTitle),
    featuredBadges: asStringArray(raw.featuredBadges, d.featuredBadges),
    featuredDescription: asString(raw.featuredDescription, d.featuredDescription),
    featuredPerks: asStringArray(raw.featuredPerks, d.featuredPerks),
    featuredImage: asString(raw.featuredImage, d.featuredImage),
    featuredPrice: asString(raw.featuredPrice, d.featuredPrice),
    featuredOriginalPrice: asString(raw.featuredOriginalPrice, d.featuredOriginalPrice),
    featuredDiscount: asString(raw.featuredDiscount, d.featuredDiscount),
    ctaText: asString(raw.ctaText, d.ctaText),
    ctaLink: asString(raw.ctaLink, d.ctaLink),
    socialProofStars: asString(raw.socialProofStars, d.socialProofStars),
    socialProofReviews: asString(raw.socialProofReviews, d.socialProofReviews),
    trustedByText: asString(raw.trustedByText, d.trustedByText),
    valuesSectionTitle: asString(raw.valuesSectionTitle, d.valuesSectionTitle),
    valuesSectionHighlight: asString(raw.valuesSectionHighlight, d.valuesSectionHighlight),
    valueBlocks: valueBlocks.length ? valueBlocks : d.valueBlocks,
    testimonialsHeading: asString(raw.testimonialsHeading, d.testimonialsHeading),
    testimonialsSubheading: asString(raw.testimonialsSubheading, d.testimonialsSubheading),
    trustTitle: asString(raw.trustTitle, d.trustTitle),
    testimonials: testimonials.length ? testimonials : d.testimonials,
    aboutLabel: asString(raw.aboutLabel, d.aboutLabel),
    aboutTitle: asString(raw.aboutTitle, d.aboutTitle),
    instituteName: asString(raw.instituteName, d.instituteName),
    instituteTags: asStringArray(raw.instituteTags, d.instituteTags),
    aboutText: asString(raw.aboutText, d.aboutText),
    aboutStats: aboutStats.length ? aboutStats : d.aboutStats,
    listSectionTitle: asString(raw.listSectionTitle, d.listSectionTitle),
    listSectionHighlight: asString(raw.listSectionHighlight, d.listSectionHighlight),
    listSectionSubtitle: asString(raw.listSectionSubtitle, d.listSectionSubtitle),
  };
}

export function normalizeWorkshopsPageContentForSave(
  raw: Record<string, unknown> = {},
): Record<string, unknown> {
  return mergeWorkshopsPageContent(raw) as unknown as Record<string, unknown>;
}
