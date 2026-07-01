import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSiteSettings, type SiteSettings } from '../../services/cmsService';
import SiteLogo from '../common/SiteLogo';
import ServicesMegaMenu from './ServicesMegaMenu';
import { SERVICES_MEGA_MENU } from '../../lib/servicesMenu';
import '../../styles/header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const servicesRef = useRef<HTMLLIElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getSiteSettings()
      .then((data) => { if (data) setSettings(data); })
      .catch((err) => console.error("Error loading header site settings:", err));
  }, []);

  useEffect(() => {
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Review', path: '/#reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  const isLibraryNavItem = (path: string, name: string) => {
    const normalizedPath = path.toLowerCase().replace(/\/+$/, '') || '/';
    const normalizedName = name.toLowerCase().trim();
    return (
      normalizedPath === '/library' ||
      normalizedName === 'video library' ||
      normalizedName === 'library'
    );
  };

  const isReviewsNav = (path: string) => path === '/#reviews';

  const isServicesActive = () => location.pathname === '/services';

  const isNavActive = (path: string) => {
    if (isReviewsNav(path)) {
      return location.pathname === '/' && location.hash === '#reviews';
    }
    return location.pathname === path;
  };

  const navLinks = primaryNavLinks.filter((link) => !isLibraryNavItem(link.path, link.name));

  const handleNavClick = (path: string) => {
    if (isReviewsNav(path) && location.pathname === '/') {
      const el = document.getElementById('reviews');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        window.history.replaceState(null, '', '/#reviews');
      }
    }
  };

  const closeMobile = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo-container">
          <SiteLogo logoUrl={settings?.logoUrl} className="site-logo" alt="GDP" />
          <div className="site-text">
            <span>Garima</span>
            <span>Dance</span>
            <span>Productions</span>
          </div>
        </Link>

        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.slice(0, 2).map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`nav-link ${isNavActive(link.path) ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li
              ref={servicesRef}
              className={`nav-item-services ${isServicesOpen ? 'open' : ''} ${isServicesActive() ? 'active' : ''}`}
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button
                type="button"
                className={`nav-link nav-link-services ${isServicesActive() ? 'active' : ''}`}
                onClick={() => setIsServicesOpen((v) => !v)}
                aria-expanded={isServicesOpen}
                aria-haspopup="true"
              >
                Services
                <span className="nav-chevron" aria-hidden="true">▾</span>
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    className="services-mega-wrap"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ServicesMegaMenu onNavigate={() => setIsServicesOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {navLinks.slice(2).map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`nav-link ${isNavActive(link.path) ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="contact-btn">Join Studio</Link>
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
            <span className="toggle-icon">{isMobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu"
          >
            <Link to="/" onClick={closeMobile} className="nav-link">Home</Link>
            <Link to="/about" onClick={closeMobile} className="nav-link">About</Link>

            <div className="mobile-services-block">
              <button
                type="button"
                className={`nav-link mobile-services-toggle ${isMobileServicesOpen ? 'open' : ''}`}
                onClick={() => setIsMobileServicesOpen((v) => !v)}
              >
                Services <span className="nav-chevron">{isMobileServicesOpen ? '▴' : '▾'}</span>
              </button>
              {isMobileServicesOpen && (
                <div className="mobile-services-panel">
                  {SERVICES_MEGA_MENU.map((group) => (
                    <div key={group.label} className="mobile-services-group">
                      <p className="mobile-services-label">{group.label}</p>
                      {group.items.map((item) => (
                        <Link key={item.href} to={item.href} onClick={closeMobile} className="mobile-services-link">
                          <strong>{item.title}</strong>
                          {item.subtitle ? <span>{item.subtitle}</span> : null}
                        </Link>
                      ))}
                      {group.viewAllHref && (
                        <Link to={group.viewAllHref} onClick={closeMobile} className="mobile-services-viewall">
                          View all services →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => { handleNavClick(link.path); closeMobile(); }}
                className={`nav-link ${isNavActive(link.path) ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={closeMobile} className="nav-link">Login</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
