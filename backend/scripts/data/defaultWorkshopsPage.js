const DEFAULT_WORKSHOPS_PAGE = {
  offerBannerText: "Hurry up! Offer for limited period only",
  showCountdown: true,
  countdownEnd: "",
  tabFreeLabel: "FREE CONTENT",
  tabVideosLabel: "VIDEOS",
  featuredTitle: "Bollywood & Wedding Choreography Masterclass 2026",
  featuredBadges: ["Lifetime Access", "Course Certificate", "Live Sessions"],
  featuredDescription:
    "Master Bollywood routines, wedding sangeet choreography, and stage presence with GDP mentors.",
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
    "Welcome to Garima Dance Productions — a modern dance studio built to help students and performers grow with real stage-ready skills.",
  aboutStats: [
    { value: "15+", label: "Years" },
    { value: "700+", label: "Weddings" },
    { value: "50K+", label: "Students" },
  ],
  listSectionTitle: "Upcoming",
  listSectionHighlight: "Workshops",
  listSectionSubtitle: "Book your spot in our next live intensives",
  featuredLabel: "Featured Workshop",
  valuesSectionTitle: "Why join",
  valuesSectionHighlight: "GDP workshops",
};

const DEFAULT_WORKSHOPS_PAGE_CONTENT = {
  slug: "workshops",
  title: "Dance Workshops | Garima Dance Productions",
  content: DEFAULT_WORKSHOPS_PAGE,
  metaTitle: "Dance Workshops | Garima Dance Productions",
  metaDescription:
    "Join intensive Bollywood, wedding choreography & performance workshops at Garima Dance Productions.",
  status: "published",
};

module.exports = { DEFAULT_WORKSHOPS_PAGE, DEFAULT_WORKSHOPS_PAGE_CONTENT };
