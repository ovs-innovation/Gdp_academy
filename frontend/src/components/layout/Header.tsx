import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SiteLogo from "../common/SiteLogo";
import LazyImage from "../common/LazyImage";
import ServicesMegaMenu from "./ServicesMegaMenu";
import { useSiteData } from "../../contexts/SiteDataContext";
import {
  DEFAULT_SERVICES,
  HOME_SERVICE_IMAGE_BY_KEY,
  isExcludedService,
} from "../../lib/defaultServices";
import { getLocalizedValue } from "../../utils/contentHelper";
import "../../styles/header.css";

const HOME_SERVICE_IMAGES = {
  regular:
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&h=700&q=80",
  fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&h=700&q=80",
  wedding:
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&h=700&q=80",
  custom:
    "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=900&h=700&q=80",
};

const resolveHomeServiceImage = (
  opts: { key?: string; title?: string; cmsImage?: string },
  index: number,
): string => {
  const cms = opts.cmsImage?.trim();
  if (
    cms &&
    (cms.startsWith("http") ||
      cms.includes("cloudinary") ||
      cms.includes("/uploads/")) &&
    !cms.includes("/svc-")
  ) {
    return cms;
  }

  const key = (opts.key || "").toLowerCase();
  if (key && HOME_SERVICE_IMAGE_BY_KEY[key]) {
    return HOME_SERVICE_IMAGE_BY_KEY[key];
  }

  const title = (opts.title || "").toLowerCase();
  if (title.includes("wedding")) return HOME_SERVICE_IMAGES.wedding;
  if (title.includes("online") || title.includes("zoom"))
    return HOME_SERVICE_IMAGES.regular;
  if (title.includes("pre-recorded") || title.includes("recorded"))
    return HOME_SERVICE_IMAGES.fitness;
  if (title.includes("kids") || title.includes("teen"))
    return HOME_SERVICE_IMAGES.custom;
  if (title.includes("fitness") || title.includes("combo"))
    return HOME_SERVICE_IMAGES.fitness;
  if (title.includes("custom")) return HOME_SERVICE_IMAGES.custom;
  return [
    HOME_SERVICE_IMAGES.regular,
    HOME_SERVICE_IMAGES.fitness,
    HOME_SERVICE_IMAGES.wedding,
    HOME_SERVICE_IMAGES.custom,
  ][index % 4];
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const { cmsSettings: settings, servicesCms } = useSiteData();
  const servicesRef = useRef<HTMLLIElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const mapped = (servicesCms || [])
      .filter((s) => !isExcludedService({ key: s.key, title: getLocalizedValue(s.title, "") }))
      .map((svc, index) => ({
        _id: svc._id,
        key: svc.key,
        title: getLocalizedValue(svc.title, ""),
        image: resolveHomeServiceImage(
          {
            key: svc.key,
            title: getLocalizedValue(svc.title, ""),
            cmsImage: svc.images?.[0]?.url,
          },
          index,
        ),
        tagline: svc.content?.tagline || svc.content?.subtitle || "Learn from experts",
        href: `/services/${svc.key}`,
      }));

    if (mapped.length > 0) {
      setServices(mapped);
    } else {
      const fallback = DEFAULT_SERVICES.map((p, idx) => ({
        _id: p.key,
        key: p.key,
        title: p.title,
        image: resolveHomeServiceImage({ key: p.key, title: p.title }, idx),
        tagline: p.tagline || p.exploreSubtitle || "",
        href: `/services/${p.key}`,
      }));
      setServices(fallback);
    }
  }, [servicesCms]);

  useEffect(() => {
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(e.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const primaryNavLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Review", path: "/#reviews" },
    { name: "Contact", path: "/contact" },
  ];

  const isReviewsNav = (path: string) =>
    path === "/#reviews" || path.toLowerCase().includes("#reviews");

  const isServicesNav = (path: string, name: string) => {
    const normalizedPath = path.toLowerCase().replace(/\/+$/, "") || "/";
    return (
      normalizedPath === "/services" || name.toLowerCase().trim() === "services"
    );
  };

  const isServicesActive = () => location.pathname === "/services";

  const isNavActive = (path: string) => {
    if (isReviewsNav(path)) {
      return location.pathname === "/" && location.hash === "#reviews";
    }
    return location.pathname === path;
  };

  const navLinks = primaryNavLinks;

  const brandLine1 = settings?.brandLine1 || "Garima";
  const brandLine2 = settings?.brandLine2 || "Dance";
  const brandLine3 = settings?.brandLine3 || "Productions";
  const headerCtaLabel = settings?.headerCtaLabel || "Join Studio";
  const headerCtaUrl = settings?.headerCtaUrl || "/login";

  const scrollToReviews = () => {
    const el = document.getElementById("reviews");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    window.history.replaceState(null, "", "/#reviews");
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMobile();
    if (location.pathname === "/") {
      scrollToReviews();
      return;
    }
    navigate("/#reviews");
  };

  const closeMobile = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="toggle-icon">{isMobileMenuOpen ? "✕" : "☰"}</span>
        </button>

        <Link to="/" className="logo-container">
          <SiteLogo
            logoUrl={settings?.logoUrl}
            className="site-logo"
            alt="GDP"
          />
          <div className="site-text">
            <span>{brandLine1}</span>
            <span>{brandLine2}</span>
            <span>{brandLine3}</span>
          </div>
        </Link>

        <nav className="desktop-nav">
          <ul className="nav-list">
            {navLinks.map((link) => {
              if (isServicesNav(link.path, link.name)) {
                return (
                  <li
                    key={link.name}
                    ref={servicesRef}
                    className={`nav-item-services ${isServicesOpen ? "open" : ""} ${isServicesActive() ? "active" : ""}`}
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                  >
                    <button
                      type="button"
                      className={`nav-link nav-link-services ${isServicesActive() ? "active" : ""}`}
                      onClick={() => setIsServicesOpen((v) => !v)}
                      aria-expanded={isServicesOpen}
                      aria-haspopup="true"
                    >
                      {link.name}
                      <span className="nav-chevron" aria-hidden="true">
                        ▾
                      </span>
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
                          <ServicesMegaMenu
                            services={services}
                            onNavigate={() => setIsServicesOpen(false)}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }

              if (isReviewsNav(link.path)) {
                return (
                  <li key={link.name}>
                    <a
                      href="/#reviews"
                      onClick={handleReviewClick}
                      className={`nav-link ${isNavActive(link.path) ? "active" : ""}`}
                    >
                      {link.name}
                    </a>
                  </li>
                );
              }

              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`nav-link ${isNavActive(link.path) ? "active" : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to={headerCtaUrl} className="contact-btn">
            {headerCtaLabel}
          </Link>
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
            {/* Prominent close button at top-right */}
            <button
              type="button"
              className="mobile-close-btn"
              onClick={closeMobile}
              aria-label="Close menu"
            >
              ✕
            </button>
            {navLinks.map((link) => {
              if (isServicesNav(link.path, link.name)) {
                return (
                  <div key={link.name} className="mobile-services-block">
                    <button
                      type="button"
                      className={`nav-link mobile-services-toggle ${isMobileServicesOpen ? "open" : ""}`}
                      onClick={() => setIsMobileServicesOpen((v) => !v)}
                    >
                      {link.name}{" "}
                      <span className="nav-chevron">
                        {isMobileServicesOpen ? "▴" : "▾"}
                      </span>
                    </button>
                    {isMobileServicesOpen && (
                      <div className="mobile-services-panel">
                        {services.map((item) => (
                          <Link
                            key={item._id || item.key}
                            to={item.href}
                            onClick={closeMobile}
                            className="mobile-services-link"
                            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                          >
                            <LazyImage
                              src={item.image}
                              alt={item.title}
                              rootMargin="80px"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "6px",
                                objectFit: "cover",
                              }}
                            />
                            <div>
                              <strong style={{ fontSize: "14px" }}>
                                {item.title}
                              </strong>
                              <span
                                style={{
                                  fontSize: "11px",
                                  color: "rgba(255, 255, 255, 0.45)",
                                }}
                              >
                                {item.tagline}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (isReviewsNav(link.path)) {
                return (
                  <a
                    key={link.name}
                    href="/#reviews"
                    onClick={handleReviewClick}
                    className={`nav-link ${isNavActive(link.path) ? "active" : ""}`}
                  >
                    {link.name}
                  </a>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobile}
                  className={`nav-link ${isNavActive(link.path) ? "active" : ""}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to={headerCtaUrl}
              onClick={closeMobile}
              className="contact-btn mobile-join-cta"
            >
              {headerCtaLabel}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
