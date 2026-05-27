import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { getSiteSettings, type SiteSettings } from '../../services/settingsService';
import { getSiteSettings as getCmsSiteSettings } from '../../services/cmsService';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [settings, setSettings] = React.useState<SiteSettings | null>(null);
  const [announcementBar, setAnnouncementBar] = React.useState<
    NonNullable<import('../../services/cmsService').SiteSettings['announcementBar']> | null
  >(null);
  const [cmsWhatsapp, setCmsWhatsapp] = React.useState<string | null>(null);

  React.useEffect(() => {
    getSiteSettings().then((s) => {
      setSettings(s);
      const cleanSiteName = s.siteName && s.siteName !== "AdminHub" ? s.siteName : "GDP";
      if (window.location.pathname === "/") {
        document.title = `${cleanSiteName} | Garima Dance Productions`;
      }
    });
    getCmsSiteSettings()
      .then((cms) => {
        if (cms?.announcementBar) {
          setAnnouncementBar(cms.announcementBar);
        }
        if (cms?.whatsappNumber) {
          setCmsWhatsapp(cms.whatsappNumber.replace(/\D/g, ""));
        }
      })
      .catch(() => {});
  }, []);

  const whatsappNumber =
    cmsWhatsapp ||
    settings?.whatsappNumber?.replace(/\D/g, "") ||
    "9711384768";
  const bar = announcementBar;
  return (
    <div className="layout-wrapper">
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
      
      {/* WhatsApp Chatbot / Floating Button */}
      <a 
        href={`https://wa.me/${whatsappNumber}`} 
        className="whatsapp-float" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
      >
        <div className="whatsapp-icon">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
            <path d="M12.031 6.172c-2.32 0-4.591 1.199-6.063 3.328-1.544 2.224-1.61 4.405-.166 6.55l-1.042 3.805 3.901-1.023c1.025.565 2.148.86 3.287.86 3.527 0 6.391-2.864 6.391-6.39 0-3.527-2.864-6.33-6.308-6.33zm5.023 9.032c-.173.483-.984.887-1.346.945-.333.053-.761.085-1.229-.074-.298-.101-.676-.239-1.144-.442-2.001-.868-3.298-2.924-3.398-3.058-.1-.134-.813-1.08-.813-2.06 0-.98.511-1.463.693-1.663.181-.2.395-.25.526-.25.132 0 .263.003.377.01.114.007.268-.043.42.321.157.377.537 1.312.584 1.41.047.098.079.213.013.344-.066.131-.098.213-.197.328-.098.115-.207.256-.296.344-.098.098-.201.205-.086.402.115.197.512.844 1.103 1.37.761.677 1.4.887 1.6.986.2.1.317.085.434-.05.117-.134.502-.585.636-.786.135-.201.27-.168.455-.098.185.07.1.536 1.171 1.036.185.085.309.127.453.223.144.095.144.18.047.453z"/>
          </svg>
        </div>
      </a>

      <style>{`
        .whatsapp-float {
          position: fixed;
          bottom: 40px;
          right: 40px;
          background: #25D366;
          color: white;
          padding: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4);
          z-index: 1000;
          transition: var(--transition-smooth);
        }
        .whatsapp-float:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 30px rgba(37, 211, 102, 0.6);
          color: white;
        }
        .whatsapp-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .whatsapp-float { bottom: 20px; right: 20px; }
        }
      `}</style>
    </div>
  );
};

export default Layout;

