/**
 * Homepage CMS defaults — mirrors frontend/src/pages/Home.tsx + Hero.tsx fallbacks.
 * Upserted by scripts/seedHomeContent.js and scripts/seed.js (slug: home).
 */

const DEFAULT_HOME_PAGE = {
  slug: "home",
  title: "Garima Dance Productions | Experience the Joy of Movement",
  metaTitle: "Garima Dance Productions | Premium Dance Classes & Training",
  metaDescription:
    "Experience professional online & offline dance coaching with Garima Dance Productions. Explore Kathak, Bollywood, and Contemporary fusion classes.",
  status: "published",
  content: {
    heroTitleLine1: "Welcome to",
    heroTitleLine2: "Garima Dance",
    heroTitleLine3: "Productions",
    heroSubtitle:
      "Premium Kathak, Contemporary, and Bollywood dance classes tailored for students worldwide. Discover rhythm, precision, and passion under expert guidance.",
    ctaText: "Explore Our Services",
    ctaUrl: "/services",

    heroVideos: [
      { url: "/hero.mp4", enabled: true, order: 0 },
      { url: "/services.mp4", enabled: true, order: 1 },
      { url: "/services4.mp4", enabled: true, order: 2 },
      { url: "/service3.mp4", enabled: true, order: 3 },
    ],

    aboutShortTitle: "Dance with Grace and Power",
    aboutShortText:
      "Garima Dance Production has been a pioneer in creating transformative dance experiences. We nurture beginner students into elegant performers and support seasoned artists in refining their technique through standard classical and modern fusion modules.",

    servicesTitle: "Services",
    servicesSubtitle: "Experience the ultimate dance training ecosystem.",

    youtubeChannel: "@garimadanceproductions1146",
    youtubeChannelUrl: "https://www.youtube.com/@garimadanceproductions1146",
    youtubeChannelId: "UCdSmMd0SD9w4SPHfNf1-CAA",
    aboutYoutubeId: "J-yM5y4Kd04",
    heroYoutubeId: "1phsCpxcBZU",

    youtubeShorts: [
      { vid: "/services.mp4", title: "Dance Reel — Studio Session", views: "1.2k", likes: "890", delay: 0 },
      { vid: "/service3.mp4", title: "Group Flow Choreography", views: "2.5k", likes: "1.1k", delay: 0.1 },
      { vid: "/services4.mp4", title: "Solo Edge Performance", views: "3.1k", likes: "1.4k", delay: 0.2 },
      { vid: "/hero.mp4", title: "Urban Move — Hip Hop", views: "1.8k", likes: "720", delay: 0.3 },
      { vid: "/service2.mp4", title: "Classical Fusion Flow", views: "2.1k", likes: "960", delay: 0.4 },
      { vid: "/services.mp4", title: "Wedding Choreo Reel", views: "3.4k", likes: "1.2k", delay: 0.5 },
      { vid: "/service3.mp4", title: "Stage Performance Clip", views: "1.6k", likes: "640", delay: 0.6 },
      { vid: "/services4.mp4", title: "Masterclass Highlight", views: "2.8k", likes: "1.0k", delay: 0.7 },
      { vid: "/hero.mp4", title: "Behind the Scenes", views: "1.9k", likes: "810", delay: 0.8 },
      { vid: "/service2.mp4", title: "Student Spotlight", views: "2.3k", likes: "940", delay: 0.9 },
    ],

    instagramHandle: "@GarimadanceProductions",
    instagramChannelUrl:
      "https://www.instagram.com/gdp_garimadanceproductions?igsh=MWhueGpqZGQzZGN0ZA==",
    instagramSectionTitle: "Join us",
    instagramSectionHighlight: "on Instagram",
    instagramPosts: [
      { vid: "/services.mp4", delay: 0, offset: "0", likes: "1.2k", comments: "45" },
      { vid: "/service2.mp4", delay: 0.1, offset: "-50px", likes: "2.5k", comments: "82" },
      { vid: "/service3.mp4", delay: 0.2, offset: "50px", likes: "890", comments: "12" },
      { vid: "/services4.mp4", delay: 0.3, offset: "-20px", likes: "3.1k", comments: "104" },
      { vid: "/hero.mp4", delay: 0.4, offset: "30px", likes: "1.7k", comments: "56" },
      { vid: "/services.mp4", delay: 0.5, offset: "-35px", likes: "2.2k", comments: "71" },
      { vid: "/service3.mp4", delay: 0.6, offset: "15px", likes: "1.4k", comments: "38" },
      { vid: "/services4.mp4", delay: 0.7, offset: "-45px", likes: "2.9k", comments: "92" },
      { vid: "/hero.mp4", delay: 0.8, offset: "40px", likes: "1.1k", comments: "29" },
      { vid: "/service2.mp4", delay: 0.9, offset: "-10px", likes: "2.0k", comments: "63" },
    ],

    testimonialsSubtitle:
      "Real stories from students, couples & performers who learned, celebrated & grew with GDP.",
    googleRating: "5.0",
    googleReviewCount: "(236)",
    videoTestimonials: [
      {
        id: 1,
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
        vid: "https://www.youtube.com/embed/2iM5RoR0khg",
      },
      {
        id: 2,
        img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
        vid: "https://www.youtube.com/embed/3PQOq9pMMl4",
      },
      {
        id: 3,
        img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80",
        vid: "https://www.youtube.com/embed/IIgDyLDnGK8",
      },
      {
        id: 4,
        img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80",
        vid: "https://www.youtube.com/embed/IC7_5UXBQvE",
      },
    ],
    googleReviews: [
      {
        name: "Gauri S.",
        position: "Wedding Choreography",
        headline: "Wonderful experience",
        message:
          "We had a wonderful experience with Garima Dance Productions. They were patient and professional, and created choreography that suited our comfort level while still looking elegant and impressive.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
        rating: 5,
      },
      {
        name: "Mona G.",
        position: "Online Dance Classes",
        headline: "So much confidence",
        message:
          "As a beginner, I am learning a lot and gaining confidence. The instructors are patient, energetic, and always willing to give feedback on your moves during class.",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80",
        rating: 5,
      },
      {
        name: "Pinke C.",
        position: "Pre-recorded Courses",
        headline: "Highly recommend",
        message:
          "I can easily join from anywhere, which makes training so convenient. Overall it has been a positive experience — I highly recommend GDP!",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
        rating: 5,
      },
    ],

    faqSubtitle:
      "We are Garima Dance Productions, helping all dance enthusiasts to live up to their dream",

    contactSectionTitle: "Let's",
    contactSectionHighlight: "Catch up?",
    contactSectionText:
      "We are Garima Dance Productions, helping all dance enthusiasts to live up to their dream",
    contactFormTitle: "Or let us reach you!",

    homeStats: [
      { value: "250K+", label: "Social Community" },
      { value: "15+", label: "Years of Experience" },
      { value: "700+", label: "Weddings Choreographed" },
      { value: "50K+", label: "Students Trained" },
    ],
  },
};

/** Patch Settings (frontend /api/settings) without wiping other fields */
const DEFAULT_SETTINGS_PATCH = {
  siteName: "Garima Dance Productions",
  heroSubtitle:
    "Premium Kathak, Contemporary, and Bollywood dance classes tailored for students worldwide. Discover rhythm, precision, and passion under expert guidance.",
  whatsappNumber: "7838416907",
  aboutText:
    "Garima Dance Production has been a pioneer in creating transformative dance experiences. We nurture beginner students into elegant performers and support seasoned artists in refining their technique through standard classical and modern fusion modules.",
};

module.exports = {
  DEFAULT_HOME_PAGE,
  DEFAULT_SETTINGS_PATCH,
};
