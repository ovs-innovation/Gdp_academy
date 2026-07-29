export type ServiceThemeId = "wedding" | "online" | "recorded" | "wellness" | "fitness" | "dance";

export type ServiceTheme = {
  id: ServiceThemeId;
  heroBadge: string;
  accent: string;
  accentRgb: string;
  accentSoft: string;
  heroGradient: string;
  processTitle: string;
  processSubtitle: string;
  ctaLabel: string;
  bookingTitle: string;
  bookingDesc: string;
  finalCtaTitle: string;
  defaultStats: { value: string; label: string }[];
  defaultFaq: { q: string; a: string }[];
  processImages: string[];
};

const IMG = {
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&h=500&q=80",
  studio: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500&q=80",
  wellness: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&h=500&q=80",
  fitness: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&h=500&q=80",
  music: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&h=500&q=80",
};

export const SERVICE_THEMES: Record<ServiceThemeId, ServiceTheme> = {
  wedding: {
    id: "wedding",
    heroBadge: "Wedding & Sangeet Specialists",
    accent: "#FF6A00",
    accentRgb: "255, 106, 0",
    accentSoft: "rgba(255, 106, 0, 0.12)",
    heroGradient:
      "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(255, 106, 0, 0.18), transparent 60%)",
    processTitle: "Your Wedding Dance Journey",
    processSubtitle: "From first consultation to show-stopping performance — stress-free and personalised.",
    ctaLabel: "BOOK WEDDING CONSULTATION",
    bookingTitle: "Plan Your Dream Performance",
    bookingDesc:
      "Share your wedding dates, events, and vision. We'll craft choreography that matches your comfort level and celebration style.",
    finalCtaTitle: "EXPLORE MORE SERVICES",
    defaultStats: [
      { value: "700+", label: "Weddings\nChoreographed" },
      { value: "12+", label: "Years\nExperience" },
      { value: "15+", label: "Countries\nReached" },
      { value: "100%", label: "Beginner\nFriendly" },
    ],
    defaultFaq: [
      { q: "How far in advance should I book?", a: "We recommend 2–3 months before your wedding for the smoothest experience." },
      { q: "Can we learn online?", a: "Yes — virtual packages via Zoom with HD recordings for practice at home." },
    ],
    processImages: [IMG.wedding, IMG.music, IMG.studio, IMG.wedding],
  },
  online: {
    id: "online",
    heroBadge: "Live Interactive Zoom Classes",
    accent: "#634BFA",
    accentRgb: "99, 75, 250",
    accentSoft: "rgba(99, 75, 250, 0.14)",
    heroGradient:
      "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(99, 75, 250, 0.22), transparent 60%)",
    processTitle: "How Online Classes Work",
    processSubtitle: "Join live batches, get real-time corrections, and progress from anywhere in the world.",
    ctaLabel: "JOIN A LIVE BATCH",
    bookingTitle: "Start Dancing From Home",
    bookingDesc:
      "Tell us your style preference and schedule. We'll place you in the right live batch with expert instructors.",
    finalCtaTitle: "VIEW ALL PROGRAMS",
    defaultStats: [
      { value: "5000+", label: "Active\nStudents" },
      { value: "15+", label: "Dance\nStyles" },
      { value: "500+", label: "Live\nBatches" },
      { value: "24/7", label: "Recording\nAccess" },
    ],
    defaultFaq: [
      { q: "Do I need prior experience?", a: "No — we have dedicated beginner batches with step-by-step teaching." },
      { q: "Are classes recorded?", a: "Yes, enrolled students receive recordings within 24 hours." },
    ],
    processImages: [IMG.studio, IMG.music, IMG.studio, IMG.fitness],
  },
  recorded: {
    id: "recorded",
    heroBadge: "Self-Paced Video Library",
    accent: "#1FEEE4",
    accentRgb: "31, 238, 228",
    accentSoft: "rgba(31, 238, 228, 0.1)",
    heroGradient:
      "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(31, 238, 228, 0.15), transparent 60%)",
    processTitle: "Learn At Your Own Pace",
    processSubtitle: "Browse, enroll, and master routines on your schedule — lifetime access included.",
    ctaLabel: "EXPLORE COURSES",
    bookingTitle: "Unlock the Video Library",
    bookingDesc:
      "Ask about course access, styles available, and which program fits your current level.",
    finalCtaTitle: "BROWSE ALL COURSES",
    defaultStats: [
      { value: "100+", label: "HD\nTutorials" },
      { value: "24/7", label: "Anytime\nAccess" },
      { value: "10K+", label: "Happy\nLearners" },
      { value: "∞", label: "Lifetime\nAccess" },
    ],
    defaultFaq: [
      { q: "How long is access valid?", a: "Lifetime access for enrolled courses — revisit anytime." },
      { q: "Can I practice slowly?", a: "Yes — slow down videos and loop sections in your dashboard." },
    ],
    processImages: [IMG.studio, IMG.music, IMG.studio, IMG.fitness],
  },
  wellness: {
    id: "wellness",
    heroBadge: "Holistic Wellness Through Movement",
    accent: "#2ED573",
    accentRgb: "46, 213, 115",
    accentSoft: "rgba(46, 213, 115, 0.12)",
    heroGradient:
      "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(46, 213, 115, 0.16), transparent 60%)",
    processTitle: "Your Wellness Roadmap",
    processSubtitle: "Safe, guided movement designed around your body, energy levels, and health goals.",
    ctaLabel: "BOOK WELLNESS SESSION",
    bookingTitle: "Begin Your Wellness Journey",
    bookingDesc:
      "Share your health goals and comfort level. Our instructors design safe, effective movement plans for you.",
    finalCtaTitle: "EXPLORE WELLNESS PROGRAMS",
    defaultStats: [
      { value: "100%", label: "Safe &\nGuided" },
      { value: "1:1", label: "Personal\nAttention" },
      { value: "4+", label: "Wellness\nTracks" },
      { value: "Expert", label: "Certified\nCoaches" },
    ],
    defaultFaq: [
      { q: "Is this safe for beginners?", a: "Absolutely — routines are low-impact and adapted to your body." },
      { q: "Do I need medical clearance?", a: "We recommend consulting your doctor for specific conditions; our team adapts sessions accordingly." },
    ],
    processImages: [IMG.wellness, IMG.wellness, IMG.studio, IMG.wellness],
  },
  fitness: {
    id: "fitness",
    heroBadge: "High-Energy Fitness Sessions",
    accent: "#FF4757",
    accentRgb: "255, 71, 87",
    accentSoft: "rgba(255, 71, 87, 0.12)",
    heroGradient:
      "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(255, 71, 87, 0.18), transparent 60%)",
    processTitle: "Your Fitness Flow",
    processSubtitle: "Burn calories, build stamina, and have fun — no boring gym routines here.",
    ctaLabel: "JOIN A FITNESS BATCH",
    bookingTitle: "Get Moving Today",
    bookingDesc:
      "Tell us your fitness level and goals. We'll recommend the perfect Zumba, HIIT, or Yoga batch for you.",
    finalCtaTitle: "SEE ALL FITNESS OPTIONS",
    defaultStats: [
      { value: "45", label: "Min\nSessions" },
      { value: "500+", label: "Calories\nBurned" },
      { value: "All", label: "Fitness\nLevels" },
      { value: "Live", label: "& Recorded\nOptions" },
    ],
    defaultFaq: [
      { q: "What fitness level do I need?", a: "All levels welcome — instructors offer modifications for every move." },
      { q: "What should I bring?", a: "Comfortable clothes, water, and a mat for yoga sessions." },
    ],
    processImages: [IMG.fitness, IMG.fitness, IMG.studio, IMG.fitness],
  },
  dance: {
    id: "dance",
    heroBadge: "Garima Dance Productions",
    accent: "#634BFA",
    accentRgb: "99, 75, 250",
    accentSoft: "rgba(99, 75, 250, 0.14)",
    heroGradient:
      "radial-gradient(ellipse 80% 60% at 70% 20%, rgba(99, 75, 250, 0.2), transparent 60%)",
    processTitle: "How It Works",
    processSubtitle: "Expert-led training tailored to your goals, schedule, and skill level.",
    ctaLabel: "BOOK A CONSULTATION",
    bookingTitle: "Let's Create Your Plan",
    bookingDesc:
      "Have questions or want a customised quote? Reach out — we respond within 24 hours.",
    finalCtaTitle: "VIEW ALL SERVICES",
    defaultStats: [
      { value: "10+", label: "Years\nTeaching" },
      { value: "5K+", label: "Students\nTrained" },
      { value: "200+", label: "Programs\nDelivered" },
      { value: "100%", label: "Expert\nLed" },
    ],
    defaultFaq: [
      { q: "Can absolute beginners join?", a: "Yes — our programs are designed for all skill levels." },
      { q: "Online or in-person?", a: "Both options available depending on the program you choose." },
    ],
    processImages: [IMG.studio, IMG.music, IMG.studio, IMG.fitness],
  },
};

export function getServiceCategory(slug: string): ServiceThemeId {
  const s = slug.toLowerCase();
  if (s.includes("wedding") || s.includes("sangeet")) return "wedding";
  if (s.includes("online") || s.includes("zoom") || s.includes("live-class")) return "online";
  if (s.includes("recorded") || s.includes("pre-recorded") || s.includes("library"))
    return "recorded";
  if (
    s.includes("wellness") ||
    s.includes("pcod") ||
    s.includes("pcos") ||
    s.includes("thyroid") ||
    s.includes("pregnancy") ||
    s.includes("post-pregnancy")
  )
    return "wellness";
  if (
    s.includes("zumba") ||
    s.includes("hiit") ||
    s.includes("yoga") ||
    s.includes("fitness") ||
    s.includes("combo")
  )
    return "fitness";
  return "dance";
}

export function getServiceTheme(slug: string, override?: ServiceThemeId): ServiceTheme {
  const id = override || getServiceCategory(slug);
  return SERVICE_THEMES[id] || SERVICE_THEMES.dance;
}
