import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getSiteSettings as getCmsSiteSettings,
  getCMSBySection,
  type SiteSettings as CmsSiteSettings,
  type CMSContent,
} from "../services/cmsService";
import {
  getSiteSettings as getAppSiteSettings,
  type SiteSettings as AppSiteSettings,
} from "../services/settingsService";

type SiteDataContextValue = {
  cmsSettings: CmsSiteSettings | null;
  appSettings: AppSiteSettings | null;
  servicesCms: CMSContent[];
  ready: boolean;
  refreshSiteData: () => void;
};

const SiteDataContext = createContext<SiteDataContextValue>({
  cmsSettings: null,
  appSettings: null,
  servicesCms: [],
  ready: false,
  refreshSiteData: () => {},
});

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [cmsSettings, setCmsSettings] = useState<CmsSiteSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSiteSettings | null>(null);
  const [servicesCms, setServicesCms] = useState<CMSContent[]>([]);
  const [ready, setReady] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadSiteData = useCallback(() => {
    setReady(false);

    Promise.all([
      getCmsSiteSettings().catch(() => null),
      getAppSiteSettings().catch(() => null),
      getCMSBySection("services").catch(() => [] as CMSContent[]),
    ]).then(([cms, app, services]) => {
      if (!mountedRef.current) return;
      if (cms) setCmsSettings(cms);
      if (app) setAppSettings(app);
      setServicesCms(services ?? []);
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
