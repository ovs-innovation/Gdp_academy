/**
 * Default homepage / services-page CMS entries (section: "services").
 * Upserted by scripts/seedServices.js and backend/scripts/seed.js
 */
const DEFAULT_CMS_SERVICES = [
  {
    key: "wedding-choreography",
    section: "services",
    title: { en: "Wedding Choreography" },
    description: {
      en: "Custom elegant and cinematic choreography for your sangeet, reception, and first dance. Available virtually worldwide or in-person with flexible schedules tailored to your comfort level.",
    },
    content: {
      tagline: "Virtual & In-Person | Worldwide",
      exploreSubtitle: "Virtual & In-Person Services Worldwide",
      features: [
        "Personalised first dance routines",
        "Group sangeet choreography",
        "Complementary music edits",
      ],
      glowClass: "purple-glow",
      order: 1,
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&h=700&q=80",
        alt: "Wedding Choreography at Garima Dance Productions",
        order: 0,
      },
    ],
    metadata: {
      seoTitle: "Wedding Choreography | Garima Dance Productions",
      seoDescription:
        "Elegant wedding and sangeet choreography — virtual or in-person, customised for your special day.",
      seoKeywords: ["wedding choreography", "sangeet dance", "first dance"],
    },
    isActive: true,
  },
  {
    key: "online-dance-classes",
    section: "services",
    title: { en: "Online Dance Classes" },
    description: {
      en: "High-quality live interactive Zoom classes led by expert instructors. Join from anywhere with real-time feedback, corrections, and a supportive dance community.",
    },
    content: {
      tagline: "Live Zoom | All Levels",
      exploreSubtitle: "Live Interactive Zoom Classes",
      features: [
        "Live interactive sessions",
        "Real-time instructor feedback",
        "Flexible morning & evening slots",
      ],
      glowClass: "green-glow",
      order: 2,
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&h=700&q=80",
        alt: "Online Dance Classes at Garima Dance Productions",
        order: 0,
      },
    ],
    metadata: {
      seoTitle: "Online Dance Classes | Garima Dance Productions",
      seoDescription:
        "Live interactive Zoom dance classes for all levels — train from home with expert GDP instructors.",
      seoKeywords: ["online dance classes", "zoom dance", "live dance training"],
    },
    isActive: true,
  },
  {
    key: "pre-recorded-courses",
    section: "services",
    title: { en: "Pre-Recorded Dance Courses" },
    description: {
      en: "Access our extensive video library of choreography tutorials and technique breakdowns. Learn at your own pace, anytime, from any device — perfect for busy schedules.",
    },
    content: {
      tagline: "24/7 Access | Self-Paced",
      exploreSubtitle: "Learn At Your Own Pace",
      features: [
        "Full choreography video library",
        "Step-by-step technique tutorials",
        "Learn anytime, anywhere",
      ],
      glowClass: "purple-glow",
      order: 3,
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&h=700&q=80",
        alt: "Pre-Recorded Dance Courses at Garima Dance Productions",
        order: 0,
      },
    ],
    metadata: {
      seoTitle: "Pre-Recorded Dance Courses | Garima Dance Productions",
      seoDescription:
        "Self-paced pre-recorded dance courses and choreography tutorials available 24/7.",
      seoKeywords: ["pre-recorded dance", "dance video library", "online choreography"],
    },
    isActive: true,
  },
];

/** Legacy keys from older hardcoded defaults — deactivated when seeding fresh services */
const LEGACY_SERVICE_KEYS = [
  "hiphop-street-foundations",
  "stage-performance-choreography",
  "kids-teens-development",
  "kids-teens-programs",
  "wedding-private-coaching",
];

module.exports = {
  DEFAULT_CMS_SERVICES,
  LEGACY_SERVICE_KEYS,
};
