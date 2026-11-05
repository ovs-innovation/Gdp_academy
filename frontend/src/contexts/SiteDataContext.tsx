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
