import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteLogo from '../common/SiteLogo';
import { useSiteData } from '../../contexts/SiteDataContext';
import { resolveContactInfo } from '../../lib/contactInfo';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import { useEnquiryPopup } from '../../contexts/EnquiryPopupContext';
import { isContactHref } from '../../lib/trialEnquiry';
import '../../styles/footer.css';

const Footer: React.FC = () => {
  const { cmsSettings: settings, contactPage, refreshSiteData } = useSiteData();
  const { openEnquiry } = useEnquiryPopup();

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshSiteData();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshSiteData]);

  const defaultSocialLinks = [
    { platform: 'Instagram', url: 'https://www.instagram.com/gdp_garimadanceproductions?igsh=MWhueGpqZGQzZGN0ZA==' },
    { platform: 'YouTube', url: 'https://youtube.com/@garimadanceproductions1146?si=XEMV40bqEVW6JM71' },
    { platform: 'WhatsApp', url: buildWhatsAppUrl('917838416907') },
  ];
  const defaultFooterLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Programs', href: '/programs' },
    { label: 'Upcoming Workshops', href: '/workshops' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'Review', href: '/#reviews' },
    { label: 'Contact', href: '/contact' },
  ];
  const defaultServiceLinks = [
    { label: 'Regular Dance Sessions', href: '/services' },
    { label: 'Fitness Sessions', href: '/services' },
    { label: 'Wedding Choreography', href: '/services' },
    { label: 'Custom Choreography', href: '/services' },
  ];

  const socialLinks =
    settings?.socialLinks && settings.socialLinks.length > 0
      ? settings.socialLinks
      : defaultSocialLinks;

  const isLibraryNavItem = (href: string, label: string) => {
    const normalizedPath = href.toLowerCase().replace(/\/+$/, '') || '/';
    const normalizedName = label.toLowerCase().trim();
    return (
      normalizedPath === '/library' ||
      normalizedName === 'video library' ||
      normalizedName === 'library'
    );
  };

  const rawFooterLinks =
    settings?.footerLinks && settings.footerLinks.length > 0
      ? settings.footerLinks
      : defaultFooterLinks;
  const filteredFooterLinks = rawFooterLinks.filter(
    (link) => !isLibraryNavItem(link.href, link.label),
  );

  const hasBlogLink = filteredFooterLinks.some(
    (link) => link.href.toLowerCase().replace(/\/+$/, '') === '/blog',
  );

  const footerLinks = hasBlogLink
    ? filteredFooterLinks
    : [...filteredFooterLinks, { label: 'Blog', href: '/blog' }];

  const serviceLinks =
    settings?.footerServiceLinks && settings.footerServiceLinks.length > 0
      ? settings.footerServiceLinks
      : defaultServiceLinks;

  const footerText =
    settings?.footerText || 'copyright@2026 Garima dance productions, All rights reserved';
  const footerTagline =
    settings?.footerTagline ||
    'Where grace meets rhythm — Garima Dance Productions empowers dancers of every level through expert-led training, live sessions, and unforgettable performances.';

  const brandLine1 = settings?.brandLine1 || 'Garima';
  const brandLine2 = settings?.brandLine2 || 'Dance';
  const brandLine3 = settings?.brandLine3 || 'Productions';

  const { phone, email, address } = resolveContactInfo(settings, contactPage?.content);

  const resolveSocialUrl = (link: { platform: string; url: string }) => {
    if (
      link.platform.toLowerCase() === 'whatsapp' ||
      link.url.includes('wa.me') ||
      link.url.includes('api.whatsapp.com')
    ) {
      const waPhone =
        settings?.whatsappNumber ||
        link.url.match(/wa\.me\/(\d+)/)?.[1] ||
        '7838416907';
      return buildWhatsAppUrl(waPhone);
    }
    return link.url;
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-container">
              <SiteLogo logoUrl={settings?.logoUrl} className="footer-site-logo" alt="GDP" />
              <div className="footer-site-text">
                <span>{brandLine1}</span>
                <span>{brandLine2}</span>
                <span>{brandLine3}</span>
              </div>
            </Link>
            <p className="footer-brand-desc">{footerTagline}</p>
          </div>

          <div className="footer-links footer-col">
            <h4>Quick links</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  {isContactHref(link.href, link.label) ? (
                    <button type="button" className="footer-text-btn" onClick={() => openEnquiry({ purpose: 'contact' })}>
                      {link.label}
                    </button>
                  ) : (
                    <Link to={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links footer-col">
            <h4>Services</h4>
            <ul>
              {serviceLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links footer-col">
            <h4>Social media</h4>
            <ul>
              {socialLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={resolveSocialUrl(link)} target="_blank" rel="noreferrer">
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links footer-col">
            <h4>Visit us</h4>
            <ul>
              <li>{address}</li>
              <li>
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              </li>
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{footerText}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
