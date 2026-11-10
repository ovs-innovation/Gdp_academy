import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { SiteSettings as CmsSiteSettings, CMSContent, FAQItem, PageContent } from "../services/cmsService";
import type { SiteSettings as AppSiteSettings } from "../services/settingsService";
import type { Testimonial } from "../services/testimonialService";
import { getHomepage } from "../services/homepageService";

const FRONTEND_THEME_COLORS: Record<string, { hex: string; gradient: string }> = {
  gdp: { hex: "#634BFA", gradient: "linear-gradient(135deg, #634BFA 0%, #1EFFE4 100%)" },
  sky: { hex: "#0284c7", gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)" },
  violet: { hex: "#8b5cf6", gradient: "linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)" },
  emerald: { hex: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)" },
  rose: { hex: "#f43f5e", gradient: "linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)" },
  amber: { hex: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" },
  orange: { hex: "#f97316", gradient: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" },
  teal: { hex: "#14b8a6", gradient: "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)" },
  pink: { hex: "#ec4899", gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)" },
  indigo: { hex: "#6366f1", gradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)" },
  cyan: { hex: "#06b6d4", gradient: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)" },
  lime: { hex: "#84cc16", gradient: "linear-gradient(135deg, #84cc16 0%, #a3e635 100%)" },
  red: { hex: "#ef4444", gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)" },
};

function applyFrontendTheme(colorInput?: string | null) {
  if (!colorInput) return;
  const clean = colorInput.toLowerCase().trim();
  const found =
    FRONTEND_THEME_COLORS[clean] ||
    (clean.startsWith("#") ? { hex: clean, gradient: `linear-gradient(135deg, ${clean} 0%, #1EFFE4 100%)` } : null);
  if (found) {
    document.documentElement.style.setProperty("--primary-color", found.hex);
    document.documentElement.style.setProperty("--gradient-primary", found.gradient);
    document.documentElement.style.setProperty("--highlight-gradient", found.gradient);
    document.documentElement.style.setProperty("--theme-purple", found.hex);
    document.documentElement.style.setProperty("--svc-purple", found.hex);
    document.documentElement.style.setProperty("--dash-primary", found.hex);
    document.documentElement.style.setProperty("--dash-gradient", found.gradient);
    document.documentElement.style.setProperty("--button-primary", found.hex);
    try {
      localStorage.setItem("theme-color", clean);
    } catch {}
  }
}

type SiteDataContextValue = {
  cmsSettings: CmsSiteSettings | null;
  appSettings: AppSiteSettings | null;
  servicesCms: CMSContent[];
  homePage: PageContent | null;
  contactPage: PageContent | null;
  faqs: FAQItem[];
  testimonials: Testimonial[];
  ready: boolean;
  refreshSiteData: () => void;
};

const SiteDataContext = createContext<SiteDataContextValue>({
  cmsSettings: null,
  appSettings: null,
  servicesCms: [],
  homePage: null,
  contactPage: null,
  faqs: [],
  testimonials: [],
  ready: false,
  refreshSiteData: () => {},
});

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [cmsSettings, setCmsSettings] = useState<CmsSiteSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSiteSettings | null>(null);
  const [servicesCms, setServicesCms] = useState<CMSContent[]>([]);
  const [homePage, setHomePage] = useState<PageContent | null>(null);
  const [contactPage, setContactPage] = useState<PageContent | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [ready, setReady] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    try {
      const stored = localStorage.getItem("theme-color");
      if (stored) applyFrontendTheme(stored);
    } catch {}
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadSiteData = useCallback(() => {
    getHomepage()
      .then((data) => {
        if (!mountedRef.current) return;
        setCmsSettings(data.siteSettings ?? null);
        setAppSettings(data.appSettings ?? null);
        setServicesCms(data.services ?? []);
        setHomePage(data.home ?? null);
        setContactPage(data.contact ?? null);
        setFaqs(data.faqs ?? []);
        setTestimonials(data.testimonials ?? []);
        setReady(true);
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    loadSiteData();
  }, [loadSiteData]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        loadSiteData();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadSiteData]);

  useEffect(() => {
    if (appSettings?.themeColor) {
      applyFrontendTheme(appSettings.themeColor);
    }
  }, [appSettings?.themeColor]);

  return (
    <SiteDataContext.Provider
      value={{
        cmsSettings,
        appSettings,
        servicesCms,
        homePage,
        contactPage,
        faqs,
        testimonials,
        ready,
        refreshSiteData: loadSiteData,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
