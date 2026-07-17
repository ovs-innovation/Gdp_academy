import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSiteSettings,
  getCMSBySection,
  type SiteSettings,
} from "../../services/cmsService";
import SiteLogo from "../common/SiteLogo";
import ServicesMegaMenu from "./ServicesMegaMenu";
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
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const servicesRef = useRef<HTMLLIElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        if (data) setSettings(data);
      })
      .catch((err) =>
        console.error("Error loading header site settings:", err),
      );

    getCMSBySection("services")
      .then((cmsServices) => {
        const defaultServices = DEFAULT_SERVICES.filter(
          (service) => !isExcludedService({ key: service.key, title: service.title }),
        ).map((service) => ({
          _id: service._id,
          key: service.key,
          title: service.title,
          image: service.imageUrl,
          tagline: service.tagline,
          mainTitle: service.description.split(".")[0] || service.title,
        }));

        let mapped = [];
        if (cmsServices && cmsServices.length > 0) {
          mapped = cmsServices
            .filter(
              (svc: { key?: string; title?: { en?: string } | string }) =>
                !isExcludedService({
                  key: svc.key,
                  title: getLocalizedValue(svc.title, ""),
                }),
            )
            .map((svc: any, index: number) => ({
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
            tagline: svc.content?.tagline || "All Levels | Expert Guided",
            mainTitle:
              getLocalizedValue(svc.description, "").split(".")[0] ||
              "Unleash your creative potential",
          }));
        } else {
          mapped = defaultServices;
        }

        if (mapped.length < 3) {
          const usedTitles = new Set(mapped.map((s) => s.title.toLowerCase()));
          const fillers = defaultServices.filter(
            (d) => !usedTitles.has(d.title.toLowerCase()),
          );
          mapped = [...mapped, ...fillers].slice(0, 3);
        } else {
          mapped = mapped.slice(0, 3);
        }

        // Add Fitness option at the end
        const fitnessItem = {
          _id: "fitness-item-mega",
          key: "fitness-classes",
          title: "Fitness Classes",
          image:
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&h=700&q=80",
          tagline: "Zumba, HIIT, Yoga & health programs",
          href: "/services#fitness-classes",
          isFitness: true,
        };

        setServices([...mapped, fitnessItem]);
      })
      .catch((err) => {
        console.error("Error loading services in header:", err);
        const mapped = DEFAULT_SERVICES.filter(
          (s) => !isExcludedService({ key: s.key, title: s.title }),
        ).map((s) => ({
          _id: s._id,
          key: s.key,
          title: s.title,
          image: s.imageUrl,
          tagline: s.tagline,
          mainTitle: s.description.split(".")[0] || s.title,
        }));
        const fitnessItem = {
          _id: "fitness-item-mega",
          key: "fitness-classes",
          title: "Fitness Classes",
          image:
            "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&h=700&q=80",
          tagline: "Zumba, HIIT, Yoga & health programs",
          href: "/services#fitness-classes",
          isFitness: true,
        };
        setServices([...mapped, fitnessItem]);
      });
  }, []);

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
    { name: "Review", path: "/#reviews" },
    { name: "Contact", path: "/contact" },
  ];

  const isLibraryNavItem = (path: string, name: string) => {
    const normalizedPath = path.toLowerCase().replace(/\/+$/, "") || "/";
    const normalizedName = name.toLowerCase().trim();
    return (
      normalizedPath === "/library" ||
      normalizedName === "video library" ||
      normalizedName === "library"
    );
  };

  const isReviewsNav = (path: string) => path === "/#reviews";

  const isServicesActive = () => location.pathname === "/services";

  const isNavActive = (path: string) => {
    if (isReviewsNav(path)) {
      return location.pathname === "/" && location.hash === "#reviews";
    }
    return location.pathname === path;
  };

  const navLinks = primaryNavLinks.filter(
    (link) => !isLibraryNavItem(link.path, link.name),
  );

  const handleNavClick = (path: string) => {
    if (isReviewsNav(path) && location.pathname === "/") {
      const el = document.getElementById("reviews");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        window.history.replaceState(null, "", "/#reviews");
      }
    }
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
          aria-label="Menu"
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
                  className={`nav-link ${isNavActive(link.path) ? "active" : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li
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
                Services
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

            {navLinks.slice(2).map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`nav-link ${isNavActive(link.path) ? "active" : ""}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/login" className="contact-btn">
            Join Studio
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
            <Link to="/" onClick={closeMobile} className="nav-link">
              Home
            </Link>
            <Link to="/about" onClick={closeMobile} className="nav-link">
              About
            </Link>

            <div className="mobile-services-block">
              <button
                type="button"
                className={`nav-link mobile-services-toggle ${isMobileServicesOpen ? "open" : ""}`}
                onClick={() => setIsMobileServicesOpen((v) => !v)}
              >
                Services{" "}
                <span className="nav-chevron">
                  {isMobileServicesOpen ? "▴" : "▾"}
                </span>
              </button>
              {isMobileServicesOpen && (
                <div className="mobile-services-panel">
                  {services.map((item) => (
                    <Link
                      key={item._id || item.key}
                      to={item.isFitness ? item.href : `/services`}
                      onClick={closeMobile}
                      className="mobile-services-link"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={item.image}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "6px",
                          objectFit: "cover",
                        }}
                        alt=""
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

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => {
                  handleNavClick(link.path);
                  closeMobile();
                }}
                className={`nav-link ${isNavActive(link.path) ? "active" : ""}`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={closeMobile} className="nav-link">
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
