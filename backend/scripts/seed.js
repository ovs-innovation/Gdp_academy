require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db.js");
const User = require("../models/userModel.js");
const FAQ = require("../models/faqModel.js");
const GalleryItem = require("../models/galleryItemModel.js");
const MembershipPlan = require("../models/membershipPlanModel.js");
const PageContent = require("../models/pageContentModel.js");
const SiteSettings = require("../models/siteSettings.js");
const { upsertServices } = require("./seedServices.js");
const { DEFAULT_HOME_PAGE } = require("./data/defaultHomePage.js");
const { DEFAULT_WORKSHOPS_PAGE_CONTENT } = require("./data/defaultWorkshopsPage.js");
const { ensureDefaultRoles } = require("../controllers/roleController.js");

const seed = async () => {
  if (process.env.CONFIRM_SEED !== "yes") {
    console.error(
      "Refusing to seed: this script DELETES FAQs, gallery, plans, page content, and site settings.",
    );
    console.error("To wipe & re-seed CMS only: CONFIRM_SEED=yes npm run seed:reset");
    process.exit(1);
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PRODUCTION_SEED !== "yes"
  ) {
    console.error(
      "Refusing to seed in production. Set ALLOW_PRODUCTION_SEED=yes only if you intend to wipe CMS data.",
    );
    process.exit(1);
  }

  try {
    console.log("Connecting to database for seeding...");
    await connectDB(process.env.MONGO_URI);

    // 1. Ensure Roles
    console.log("Ensuring roles exist...");
    await ensureDefaultRoles();

    // 2. Create Admin user if not exists
    console.log("Checking for admin user...");
    const adminEmail = "admin@gdpstudio.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "Garima Dance Production Admin",
        email: adminEmail,
        password: "adminpassword", // Will be hashed by userSchema pre-save hook
        role: "admin",
        status: "active"
      });
      console.log("Admin user created: admin@gdpstudio.com / adminpassword");
    } else {
      console.log("Admin user already exists");
    }

    // 3. Clear existing CMS data and seed default ones
    console.log("Clearing existing FAQs, GalleryItems, MembershipPlans, PageContent, SiteSettings...");
    await FAQ.deleteMany({});
    await GalleryItem.deleteMany({});
    await MembershipPlan.deleteMany({});
    await PageContent.deleteMany({});
    await SiteSettings.deleteMany({});

    // 4. Seed FAQs
    console.log("Seeding FAQs...");
    const faqs = [
      {
        question: "What dance styles do you teach at Garima Dance Production?",
        answer: "We specialize in a rich variety of Indian classical and modern styles including Kathak, Bharatnatyam, Bollywood, Contemporary, and traditional Folk dances. Our classes are designed for all levels of experience.",
        order: 1,
        status: "published"
      },
      {
        question: "Do you offer online live Zoom classes?",
        answer: "Yes, absolutely! We offer high-quality live interactive classes via Zoom. In addition, students have 24/7 access to our extensive video library containing pre-recorded choreography and tutorial sessions.",
        order: 2,
        status: "published"
      },
      {
        question: "Can absolute beginners join the programs?",
        answer: "Yes, we welcome dancers of all levels. We have foundation programs tailored specifically for beginners to help build rhythm, grace, posture, and core dance techniques from the ground up.",
        order: 3,
        status: "published"
      },
      {
        question: "How do the membership plans work?",
        answer: "We offer flexible monthly and annual plans. Each plan grants access to specific live sessions, complete video library access, workshop discounts, and one-on-one virtual choreography assessments based on your selected tier.",
        order: 4,
        status: "published"
      }
    ];
    await FAQ.insertMany(faqs);
    console.log("FAQs seeded successfully.");

    // 5. Seed Gallery Items
    console.log("Seeding Gallery Items...");
    const galleryItems = [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
        caption: "Kathak Classical Performance - Annual Recital",
        order: 1,
        status: "published"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80",
        caption: "Contemporary Fusion Workshop in Progress",
        order: 2,
        status: "published"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&w=800&q=80",
        caption: "Bollywood High-Energy Class Celebration",
        order: 3,
        status: "published"
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        caption: "Folk Dance Celebrations - Navratri Special",
        order: 4,
        status: "published"
      }
    ];
    await GalleryItem.insertMany(galleryItems);
    console.log("Gallery items seeded successfully.");

    // 6. Seed Membership Plans
    console.log("Seeding Membership Plans...");
    const plans = [
      {
        title: "Starter Passion Plan",
        price: 29,
        currency: "USD",
        duration: 1,
        durationUnit: "month",
        features: [
          "Access to 2 Live Zoom classes per month",
          "Beginner choreography video library access",
          "Community forum discussion access",
          "Standard email support"
        ],
        order: 1,
        status: "published"
      },
      {
        title: "Pro Performer Plan",
        price: 59,
        currency: "USD",
        duration: 1,
        durationUnit: "month",
        features: [
          "Access to 8 Live Zoom classes per month",
          "Full access to entire pre-recorded library",
          "Interactive feedback from choreographers",
          "10% discount on special workshops",
          "Priority support response"
        ],
        order: 2,
        status: "published"
      },
      {
        title: "Elite Master Plan",
        price: 99,
        currency: "USD",
        duration: 1,
        durationUnit: "month",
        features: [
          "Unlimited access to all Live Zoom sessions",
          "Unlimited access to video library & masterclasses",
          "Monthly 1-on-1 personalized review",
          "Free entry to all seasonal workshops",
          "Certificate of completion & VIP support"
        ],
        order: 3,
        status: "published"
      }
    ];
    await MembershipPlan.insertMany(plans);
    console.log("Membership plans seeded successfully.");

    // 7. Seed Page Content
    console.log("Seeding Page Content...");
    const pages = [
      {
        slug: DEFAULT_HOME_PAGE.slug,
        title: DEFAULT_HOME_PAGE.title,
        content: DEFAULT_HOME_PAGE.content,
        metaTitle: DEFAULT_HOME_PAGE.metaTitle,
        metaDescription: DEFAULT_HOME_PAGE.metaDescription,
        status: DEFAULT_HOME_PAGE.status,
      },
      DEFAULT_WORKSHOPS_PAGE_CONTENT,
      {
        slug: "about",
        title: "About Garima Dance Production",
        content: {
          storyTitle: "Our Movement Story",
          storyText: "Founded with the dream of making cultural and modern dance forms accessible worldwide, Garima Dance Production brings a fusion of discipline, grace, and storytelling. We focus on physical mastery alongside deep expressive performance elements.",
          missionTitle: "Our Mission",
          missionText: "To empower individuals to express themselves freely through dance, while honoring deep cultural roots and embracing contemporary innovation.",
        },
        metaTitle: "About Us | Garima Dance Production",
        metaDescription: "Learn about our journey, vision, and team at Garima Dance Production. We are dedicated to classical and modern dance education.",
        status: "published"
      },
      {
        slug: "contact",
        title: "Connect With Our Dance Family",
        content: {
          headerTitle: "Get in Touch",
          headerSubtitle: "We love hearing from fellow dancers, prospective students, and collaborators! Reach out for general inquiries, booking details, or customized workshop sessions.",
          address: "123 Creative Rhythm Way, Dance Arts District, New Delhi, India",
          phone: "+91 98765 43210",
          email: "hello@gdpstudio.com"
        },
        metaTitle: "Contact Us | Garima Dance Production",
        metaDescription: "Have questions about our programs, zoom classes, or schedules? Get in touch with us today.",
        status: "published"
      },
      {
        slug: "terms",
        title: "Terms of Service | Garima Dance Production",
        content: {
          sections: [
            {
              title: "1. Acceptance of Terms",
              text: "By accessing and using the GDP Studio platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services."
            },
            {
              title: "2. Membership & Payments",
              text: "Memberships are billed based on the plan selected. Payments are non-refundable unless otherwise specified. GDP Studio reserves the right to modify pricing with 30 days notice."
            },
            {
              title: "3. Code of Conduct",
              text: "All members are expected to maintain a professional and respectful environment during live sessions and in the community forums. Harassment or disruptive behavior will result in immediate termination of membership."
            },
            {
              title: "4. Intellectual Property",
              text: "All video content, choreography, and educational materials provided on this platform are the property of GDP Studio and may not be reproduced or shared without explicit permission."
            }
          ]
        },
        metaTitle: "Terms of Service | Garima Dance Production",
        metaDescription: "Read the Terms of Service for using the Garima Dance Production platform.",
        status: "published"
      },
      {
        slug: "privacy",
        title: "Privacy Policy | Garima Dance Production",
        content: {
          sections: [
            {
              title: "1. Data Collection",
              text: "We collect personal information such as your name, email, and payment details when you register for a membership. We also track usage data to improve our educational content."
            },
            {
              title: "2. Use of Information",
              text: "Your data is used to provide access to the platform, process payments, and communicate studio updates. We do not sell your personal information to third parties."
            },
            {
              title: "3. Data Security",
              text: "We implement industry-standard security measures to protect your data. Payment information is processed through secure, encrypted providers (e.g., Stripe/PayPal)."
            },
            {
              title: "4. Your Rights",
              text: "You have the right to access, correct, or delete your personal data at any time through your member dashboard or by contacting support."
            }
          ]
        },
        metaTitle: "Privacy Policy | Garima Dance Production",
        metaDescription: "Read the Privacy Policy to understand how Garima Dance Production handles your personal data.",
        status: "published"
      }
    ];
    await PageContent.insertMany(pages);
    console.log("Page content seeded successfully.");

    // 8. Seed Site Settings
    console.log("Seeding Site Settings...");
    const settings = {
      logoUrl: "/logo.png",
      navLinks: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Review", href: "/#reviews" },
        { label: "Contact", href: "/contact" }
      ],
      footerLinks: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Services", href: "/services" },
        { label: "Review", href: "/#reviews" },
        { label: "Contact", href: "/contact" },
        { label: "Programs", href: "/programs" },
        { label: "Upcoming Workshops", href: "/workshops" },
        { label: "Gallery", href: "/gallery" }
      ],
      footerText: "© 2026 Garima Dance Production. Designed to inspire movement, elegance, and cultural legacy.",
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com/garimadanceproduction" },
        { platform: "YouTube", url: "https://youtube.com/garimadanceproduction" },
        { platform: "Facebook", url: "https://facebook.com/garimadanceproduction" }
      ],
      metaTitle: "Garima Dance Production | International Dance Platform",
      metaDescription: "Join the premier platform for Indian Classical, Bollywood, and Contemporary dance education.",
      canonicalUrl: "https://gdpstudio.com"
    };
    await SiteSettings.create(settings);
    console.log("Site settings seeded successfully.");

    // 9. Seed Homepage Services (CMS)
    await upsertServices({ deactivateLegacy: true });

    console.log("=========================================");
    console.log("DATABASE SEEDING SUCCESSFUL! 🎉");
    console.log("=========================================");
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error ❌:");
    console.error(error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seed();
