/** Fallback when CMS services API returns empty — mirrors backend/scripts/data/defaultServices.js */

const WEDDING_IMG =
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&h=700&q=80";
const ONLINE_IMG =
  "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&h=700&q=80";
const RECORDED_IMG =
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&h=700&q=80";
const KIDS_IMG =
  "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=900&h=700&q=80";

export type DefaultServiceItem = {
  _id: string;
  key: string;
  title: string;
  description: string;
  features: string[];
  exploreSubtitle: string;
  tagline: string;
  imageUrl: string;
  glowClass: "purple-glow" | "green-glow";
};

export const DEFAULT_SERVICES: DefaultServiceItem[] = [
  {
    _id: "default-1",
    key: "wedding-choreography",
    title: "Wedding Choreography",
    description:
      "Custom elegant and cinematic choreography for your sangeet, reception, and first dance. Available virtually worldwide or in-person with flexible schedules tailored to your comfort level.",
    features: [
      "Personalised first dance routines",
      "Group sangeet choreography",
      "Complementary music edits",
    ],
    exploreSubtitle: "Virtual & In-Person Services Worldwide",
    tagline: "Virtual & In-Person | Worldwide",
    imageUrl: WEDDING_IMG,
    glowClass: "purple-glow",
  },
  {
    _id: "default-2",
    key: "online-dance-classes",
    title: "Online Dance Classes",
    description:
      "High-quality live interactive Zoom classes led by expert instructors. Join from anywhere with real-time feedback, corrections, and a supportive dance community.",
    features: [
      "Live interactive sessions",
      "Real-time instructor feedback",
      "Flexible morning & evening slots",
    ],
    exploreSubtitle: "Live Interactive Zoom Classes",
    tagline: "Live Zoom | All Levels",
    imageUrl: ONLINE_IMG,
    glowClass: "green-glow",
  },
  {
    _id: "default-3",
    key: "pre-recorded-courses",
    title: "Pre-Recorded Dance Courses",
    description:
      "Access our extensive video library of choreography tutorials and technique breakdowns. Learn at your own pace, anytime, from any device — perfect for busy schedules.",
    features: [
      "Full choreography video library",
      "Step-by-step technique tutorials",
      "Learn anytime, anywhere",
    ],
    exploreSubtitle: "Learn At Your Own Pace",
    tagline: "24/7 Access | Self-Paced",
    imageUrl: RECORDED_IMG,
    glowClass: "purple-glow",
  },
  {
    _id: "default-4",
    key: "kids-teens-programs",
    title: "Kids & Teens Programs",
    description:
      "A fun, disciplined structure for young dancers to build coordination, musicality, and creative expression in a safe and encouraging environment with age-appropriate routines.",
    features: [
      "Age-appropriate routines",
      "Confidence & discipline building",
      "Biannual showcase events",
    ],
    exploreSubtitle: "Confidence & Creative Expression",
    tagline: "Ages 5–17 | All Styles",
    imageUrl: KIDS_IMG,
    glowClass: "green-glow",
  },
];

export const HOME_SERVICE_IMAGE_BY_KEY: Record<string, string> = Object.fromEntries(
  DEFAULT_SERVICES.map((s) => [s.key, s.imageUrl]),
);
