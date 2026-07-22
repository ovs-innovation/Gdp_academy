import React, { createContext, useContext, useEffect, useState } from "react";
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
};

const SiteDataContext = createContext<SiteDataContextValue>({
  cmsSettings: null,
  appSettings: null,
  servicesCms: [],
  ready: false,
});

export function SiteDataProvider({ children }: { children: React.ReactNode }) {
  const [cmsSettings, setCmsSettings] = useState<CmsSiteSettings | null>(null);
  const [appSettings, setAppSettings] = useState<AppSiteSettings | null>(null);
  const [servicesCms, setServicesCms] = useState<CMSContent[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      getCmsSiteSettings().catch(() => null),
      getAppSiteSettings().catch(() => null),
      getCMSBySection("services").catch(() => [] as CMSContent[]),
    ]).then(([cms, app, services]) => {
      if (!mounted) return;
      if (cms) setCmsSettings(cms);
      if (app) setAppSettings(app);
      if (services?.length) setServicesCms(services);
      setReady(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SiteDataContext.Provider value={{ cmsSettings, appSettings, servicesCms, ready }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
