import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

export interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
  servicesTitle?: string;
  servicesSubtitle?: string;
  announcementText?: string;
  whatsappNumber: string;
  themeColor: string;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "GDP Academy",
  heroTitle: "ELEVATE YOUR ARTISTRY",
  heroSubtitle: "Step into the world's most prestigious dance sanctuary. Where passion meets precision, and every move tells a story.",
  aboutText: "Garima Dance Production is a sanctuary for artists, where technique meets expression in a cinematic environment.",
  finalCtaTitle: "READY TO BEGIN YOUR TRANSFORMATION?",
  finalCtaSubtitle: "Join Garima Dance Production today and unlock your true artistic potential.",
  servicesTitle: "OUR SERVICES",
  servicesSubtitle: "Experience the ultimate dance training ecosystem.",
  announcementText: "NEW WORKSHOP: CONTEMPORARY MASTERCLASS - ENROLLMENT OPEN NOW!",
  whatsappNumber: "1234567890",
  themeColor: "#634BFA"
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  const shouldFetchInDev =
    !import.meta.env.DEV ||
    import.meta.env.VITE_FETCH_SITE_SETTINGS === 'true' ||
    Boolean(import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL);

  if (!shouldFetchInDev) {
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const response = await axios.get(`${API_URL}/settings`);
    return response.data.settings;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Using default site settings because the API is unavailable.', error);
    }
    return DEFAULT_SITE_SETTINGS;
  }
};
