import axios from "axios";
import { API_BASE_URL } from "../lib/apiConfig";

const API_URL = API_BASE_URL;

export interface SiteSettings {
  siteName: string;
  logoUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  heroCTAButtons?: { label: string; url: string }[];
  heroStatistics?: string;
  heroTrustLogos?: string;
  heroVideos?: { url: string; enabled?: boolean; order?: number }[];
  announcementBar?: {
    enabled: boolean;
    text: string;
    buttonLabel: string;
    buttonUrl: string;
    backgroundColor: string;
    textColor: string;
  };
  cmsSections?: Record<
    string,
    {
      sectionTitle: string;
      sectionSubtitle: string;
      featuredItems: any[];
      ctaLabel: string;
      ctaUrl: string;
      isVisible?: boolean;
      displayOrder?: number;
    }
  >;
  aboutText: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  servicesTitle?: string;
  servicesSubtitle?: string;

  // Used by frontend pages/dashboard
  servicesHeroLabel?: string;
  servicesCtaLabel?: string;

  // Used by Home page
  upcomingWorkshopsTitle?: string;
  upcomingWorkshopsSubtitle?: string;

  servicesDetailKeyModulesLabel?: string;
  servicesDetailJoinButton?: string;
  servicesDetailBookEnquiryButton?: string;
  servicesDetailExploreOtherOptionsLabel?: string;
  servicesDetailExploreOtherServicesLabel?: string;
  servicesDetailHeroLabel?: string;
  servicesDetailHeroSubtitle?: string;
  servicesDetailOverviewLabel?: string;
  servicesDetailOverviewTitle?: string;
  servicesDetailCtaLabelPrimary?: string;
  servicesDetailCtaLabelSecondary?: string;
  faqTitle?: string;
  faqSubtitle?: string;
  contactSectionTitle?: string;
  contactSectionSubtitle?: string;
  announcementText?: string;
  whatsappNumber: string;
  themeColor: string;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "GDP Studio",
  logoUrl: "",
  heroTitle: "ELEVATE YOUR ARTISTRY",
  heroSubtitle:
    "Step into the world's most prestigious dance sanctuary. Where passion meets precision, and every move tells a story.",
  heroBadge: "Featured",
  heroCTAButtons: [{ label: "GET STARTED", url: "/programs" }],
  heroStatistics: "10 Years, 5K Students, 200 Programs",
  heroTrustLogos: "Partner1,Partner2,Partner3",
  heroVideos: [],
  announcementBar: {
    enabled: false,
    text: "",
    buttonLabel: "",
    buttonUrl: "",
    backgroundColor: "#060606",
    textColor: "#FFFFFF",
  },
  cmsSections: {},
  aboutText:
    "Garima Dance Production is a sanctuary for artists, where technique meets expression in a cinematic environment.",
  finalCtaTitle: "READY TO BEGIN YOUR TRANSFORMATION?",
  finalCtaSubtitle:
    "Join Garima Dance Production today and unlock your true artistic potential.",
  servicesTitle: "OUR SERVICES",
  servicesHeroLabel: "OUR PROGRAMS",
  servicesCtaLabel: "EXPLORE PROGRAM",
  upcomingWorkshopsTitle: "UPCOMING WORKSHOPS",
  upcomingWorkshopsSubtitle:
    "Join our high-energy live sessions and intensive masterclasses.",
  servicesDetailHeroLabel: "PROGRAM IN FOCUS",
  servicesDetailHeroSubtitle:
    "Explore technical focus, schedules, and custom packages for our specialized modules.",
  servicesDetailOverviewLabel: "OVERVIEW",
  servicesDetailOverviewTitle: "THE TECHNIQUE & DISCIPLINE",
  servicesDetailKeyModulesLabel: "KEY MODULE HIGHLIGHTS",
  servicesDetailJoinButton: "JOIN PROGRAM",
  servicesDetailBookEnquiryButton: "BOOK ENQUIRY",
  servicesDetailExploreOtherOptionsLabel: "EXPLORE OTHER OPTIONS",
  servicesDetailExploreOtherServicesLabel: "EXPLORE OTHER SERVICES",
  servicesDetailCtaLabelPrimary: "JOIN PROGRAM",
  servicesDetailCtaLabelSecondary: "BOOK ENQUIRY",
  contactSectionTitle: "Let's",
  contactSectionSubtitle: "Catch up?",
  announcementText:
    "NEW WORKSHOP: CONTEMPORARY MASTERCLASS - ENROLLMENT OPEN NOW!",
  whatsappNumber: "1234567890",
  themeColor: "#634BFA",
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data.settings;
  } catch (error) {
    console.warn(
      "Using default site settings because the API is unavailable.",
      error,
    );
    return DEFAULT_SITE_SETTINGS;
  }
};

export const updateSiteSettings = async (
  settings: SiteSettings,
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/settings`, settings);
  } catch (error) {
    // Keep compile-time behavior stable: allow dashboard save UI without hard crash
    console.warn("Failed to update site settings (API unavailable).", error);
  }
};
