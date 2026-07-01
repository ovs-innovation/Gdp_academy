import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSiteSettings, getPageContentBySlug, type SiteSettings, type PageContent } from '../../services/cmsService';
import SiteLogo from '../common/SiteLogo';
import '../../styles/footer.css';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [contactPage, setContactPage] = useState<PageContent | null>(null);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((err) => console.error('Error loading footer site settings:', err));

    getPageContentBySlug('contact')
      .then((data) => {
        if (data) setContactPage(data);
      })
      .catch((err) => console.error('Error loading footer contact settings:', err));
  }, []);

  const defaultSocialLinks = [
    { platform: 'Instagram', url: 'https://www.instagram.com/gdp_garimadanceproductions?igsh=MWhueGpqZGQzZGN0ZA==' },
    { platform: 'YouTube', url: 'https://youtube.com/@garimadanceproductions1146?si=XEMV40bqEVW6JM71' },
    { platform: 'WhatsApp', url: 'https://wa.me/919711384768' },
  ];
  const defaultFooterLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Review', href: '/#reviews' },
    { label: 'Contact', href: '/contact' },
    { label: 'Programs', href: '/programs' },
    { label: 'Upcoming Workshops', href: '/workshops' },
    { label: 'Gallery', href: '/gallery' },
  ];

  const socialLinks =
    settings && settings.socialLinks && settings.socialLinks.length > 0
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

  const footerLinks = defaultFooterLinks.filter((link) => !isLibraryNavItem(link.href, link.label));

  const footerText =
    settings?.footerText || 'copyright@2026 Garima dance productions, All rights reserved';
  const footerTagline =
    'Where grace meets rhythm — Garima Dance Productions empowers dancers of every level through expert-led training, live sessions, and unforgettable performances.';

  const address =
    contactPage?.content?.address ||
    'K-6, near SANDISH MEDICAL, Sector-12, Block-K, Pratap Vihar, Ghaziabad, Uttar Pradesh 201009';
  const phone = contactPage?.content?.phone || '9711384768';
  const email = contactPage?.content?.email || 'Garima@productions.com';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-container">
              <SiteLogo logoUrl={settings?.logoUrl} className="footer-site-logo" alt="GDP" />
              <div className="footer-site-text">
                <span>Garima</span>
                <span>Dance</span>
                <span>Productions</span>
              </div>
            </Link>
            <p className="footer-brand-desc">{footerTagline}</p>
          </div>

          <div className="footer-links footer-col">
            <h4>Quick links</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Regular Dance Sessions</Link></li>
              <li><Link to="/services">Fitness Sessions</Link></li>
              <li><Link to="/services">Wedding Choreography</Link></li>
              <li><Link to="/services">Custom Choreography</Link></li>
            </ul>
          </div>

          <div className="footer-links footer-col">
            <h4>Social media</h4>
            <ul>
              {socialLinks.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-contact footer-col">
            <h4>Contact us</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="footer-contact-label">Address</span>
                <p>{address}</p>
              </li>
              <li>
                <span className="footer-contact-label">Phone</span>
                <p><a href={`tel:${phone}`}>{phone}</a></p>
              </li>
              <li>
                <span className="footer-contact-label">Email</span>
                <p><a href={`mailto:${email}`}>{email}</a></p>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{footerText}</p>
          <div className="footer-bottom-links">
            <Link to="/faq">FAQ</Link>
            <Link to="/terms">Terms and conditions</Link>
            <Link to="/privacy">Privacy policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
