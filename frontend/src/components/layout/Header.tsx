import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSiteSettings, type SiteSettings } from '../../services/cmsService';
import { resolvePublicMediaUrl } from '../../utils/mediaUrl';
import '../../styles/header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((err) => console.error("Error loading header site settings:", err));
  }, []);

  const defaultNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Programs', path: '/programs' },
    { name: 'Workshops', path: '/workshops' },
    { name: 'Gallery', path: '/gallery' },
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

  const navLinks = (settings && settings.navLinks && settings.navLinks.length > 0
    ? settings.navLinks.map((link) => ({ name: link.label, path: link.href }))
    : defaultNavLinks
  ).filter((link) => !isLibraryNavItem(link.path, link.name));

  const logoSrc = resolvePublicMediaUrl(settings?.logoUrl) || '/logo.png';

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <Link to="/" className="logo-container">
          <img src={logoSrc} alt="GDP" className="site-logo" />
          <div className="site-text">
            <span>Garima</span>
            <span>Dance</span>
            <span>Productions</span>
          </div>
        </Link>

        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="contact-btn">Join Studio</Link>
          
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="nav-link">Login</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

