import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollProgressBar from '../common/ScrollProgressBar';
import { useSiteData } from '../../contexts/SiteDataContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { appSettings: settings, cmsSettings } = useSiteData();
  const announcementBar = cmsSettings?.announcementBar ?? null;

  React.useEffect(() => {
    if (!settings) return;
    const cleanSiteName = settings.siteName && settings.siteName !== "AdminHub" ? settings.siteName : "GDP";
    if (window.location.pathname === "/") {
      document.title = `${cleanSiteName} | Garima Dance Productions`;
    }
  }, [settings]);

  const bar = announcementBar;
  return (
    <div className="layout-wrapper">
      <ScrollProgressBar />
      {bar?.enabled && bar.text ? (
        <div
          className="announcement-banner"
          style={{
            background: bar.backgroundColor || undefined,
            color: bar.textColor || undefined,
          }}
        >
          <p style={{ margin: 0, color: bar.textColor || undefined }}>
            {bar.text}
            {bar.buttonLabel && bar.buttonUrl ? (
              <>
                {' '}
                <a
                  href={bar.buttonUrl}
                  style={{ color: bar.textColor || 'inherit', textDecoration: 'underline' }}
                >
                  {bar.buttonLabel}
                </a>
              </>
            ) : null}
          </p>
        </div>
      ) : null}
      <Header />
      <main className="content-area">
        {children}
      </main>
      <Footer />
      
    </div>
  );
};

export default Layout;

