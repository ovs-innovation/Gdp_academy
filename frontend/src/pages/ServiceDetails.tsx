import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";

import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import { getCMSBySection, type CMSContent } from "../services/cmsService";
import {
  getSiteSettings,
  type SiteSettings,
} from "../services/settingsService";

import "../styles/services.css";

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<CMSContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  useEffect(() => {
    setLoading(true);
    getCMSBySection("services")
      .then((data) => {
        setServices(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load services for details:", err);
        setServices([]);
        setLoading(false);
      });
  }, [id]);

  const defaultServices = [
    {
      _id: "default-1",
      key: "hiphop-street-foundations",
      title: "HIP HOP & STREET FOUNDATIONS",
      description:
        "Master street foundations, grooves, and advanced textures in a high-energy environment. Perfect for beginners to advanced dancers looking to perfect their urban styles.",
      features: [
        "Rhythm & Bounce Control",
        "Advanced Texture & Isolation",
        "Freestyle & Cypher Training",
      ],
      imageUrl: "/svc-hiphop.png",
      glowClass: "purple-glow",
    },
    {
      _id: "default-2",
      key: "stage-performance-choreography",
      title: "STAGE PERFORMANCE & CHOREOGRAPHY",
      description:
        "Advanced training focused on camera awareness, stage blocking, and live audience impact. Learn complex routines and performance dynamics from elite mentors.",
      features: [
        "Masterclass Choreography",
        "Stage Presence & Blocking",
        "Commercial Dance Prep",
      ],
      imageUrl: "/svc-stage.png",
      glowClass: "green-glow",
    },
    {
      _id: "default-3",
      key: "kids-teens-development",
      title: "KIDS & TEENS DEVELOPMENT",
      description:
        "A fun, disciplined structure for young dancers to develop coordination, musicality, and creative expression in a safe and supportive environment.",
      features: [
        "Age-Appropriate Routines",
        "Confidence & Discipline Building",
        "Biannual Showcase Events",
      ],
      imageUrl: "/svc-kids.jpg",
      glowClass: "purple-glow",
    },
    {
      _id: "default-4",
      key: "wedding-private-coaching",
      title: "WEDDING & PRIVATE COACHING",
      description:
        "Custom elegant and cinematic choreography to make your special moments unforgettable. One-on-one sessions tailored completely to your song and style.",
      features: [
        "Custom Wedding First Dance",
        "Group Sangeet Choreography",
        "1-on-1 Private Mentorship",
      ],
      imageUrl: "/svc-wedding.jpg",
      glowClass: "green-glow",
    },
  ];

  const getLocalizedValue = (
    val: string | { en: string; [key: string]: string } | undefined | null,
    fallback: string,
  ): string => {
    if (!val) return fallback;
    if (typeof val === "string") return val;
    return val.en || Object.values(val)[0] || fallback;
  };

  // Build uniform services list
  const allServices =
    services.length > 0
      ? services.map((svc, index) => {
          const features = Array.isArray(svc.content?.features)
            ? svc.content.features
            : typeof svc.content?.features === "string"
              ? svc.content.features.split(",").map((f: string) => f.trim())
              : [];

          return {
            _id: svc._id,
            key: svc.key,
            title: getLocalizedValue(svc.title, ""),
            description: getLocalizedValue(svc.description, ""),
            features:
              features.length > 0
                ? features
                : [
                    "Expert Training",
                    "Aesthetic Environment",
                    "Cinematic Mastery",
                  ],
            imageUrl:
              svc.images && svc.images.length > 0
                ? svc.images[0].url
                : `/svc-default.png`,
            glowClass:
              (svc.content as any)?.glowClass ||
              (index % 2 === 0 ? "purple-glow" : "green-glow"),
          };
        })
      : defaultServices;

  const currentService =
    allServices.find((s) => s._id === id || s.key === id) || allServices[0];

  const otherServices = allServices.filter(
    (s) => s._id !== currentService._id && s.key !== currentService.key,
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#060606",
            color: "#634BFA",
            fontFamily: "Krona One",
            letterSpacing: "4px",
          }}
        >
          LOADING SERVICE DETAILS...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO pageTitle={currentService?.title || "Service Details"} />
      <div className="services-page-wrapper">
        {/* ================= 1. DETAIL HERO SECTION ================= */}
        <section
          className="svc-hero-section"
          style={{ minHeight: "60vh", padding: "160px 20px 80px" }}
        >
          <div className="svc-hero-bg"></div>
          <div className="svc-hero-smoke"></div>

          <div className="container" style={{ zIndex: 2 }}>
            <motion.div
              className="svc-hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <div className="cyber-label" style={{ justifyContent: "center" }}>
                {settings?.servicesDetailHeroLabel || "PROGRAM IN FOCUS"}
              </div>
              <motion.h1
                className="svc-hero-title"
                variants={fadeInUp}
                style={{ fontSize: "clamp(32px, 6vw, 70px)" }}
              >
                {currentService?.title}
              </motion.h1>
              <motion.p
                className="svc-hero-subtitle"
                variants={fadeInUp}
                style={{ maxWidth: "800px" }}
              >
                {settings?.servicesDetailHeroSubtitle ||
                  "Explore technical focus, schedules, and custom packages for our specialized modules."}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ================= 2. FOCUS CONTENT SECTION ================= */}
        <section className="svc-detailed-section" style={{ padding: "80px 0" }}>
          <div className="container">
            <div className="svc-block-row">
              <div className="svc-block-content">
                <div className="cyber-label">
                  {settings?.servicesDetailOverviewLabel || "OVERVIEW"}
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-krona)",
                    fontSize: "28px",
                    color: "#fff",
                    margin: "20px 0 25px",
                  }}
                >
                  {settings?.servicesDetailOverviewTitle ||
                    "THE TECHNIQUE & DISCIPLINE"}
                </h2>
                <p
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.8",
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: "35px",
                  }}
                >
                  {currentService?.description}
                </p>

                <h3
                  style={{
                    fontFamily: "var(--font-krona)",
                    fontSize: "15px",
                    color: "#fff",
                    letterSpacing: "1px",
                    marginBottom: "20px",
                    textTransform: "uppercase",
                  }}
                >
                  {settings?.servicesDetailKeyModulesLabel ||
                    "KEY MODULE HIGHLIGHTS"}
                </h3>
                <ul
                  className="svc-feature-list"
                  style={{ marginBottom: "40px" }}
                >
                  {currentService?.features?.map(
                    (feat: string, idx: number) => (
                      <li key={idx} style={{ fontSize: "15px" }}>
                        <span style={{ color: "var(--svc-green)" }}>✦</span>{" "}
                        {feat}
                      </li>
                    ),
                  )}
                </ul>

                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  <Link to="/signup" className="svc-btn-glow">
                    {settings?.servicesDetailCtaLabelPrimary || "JOIN PROGRAM"}
                  </Link>
                  <Link
                    to="/contact"
                    className="svc-btn-glow"
                    style={{
                      borderColor: "rgba(255,255,255,0.2)",
                      color: "#fff",
                      boxShadow: "none",
                    }}
                  >
                    {settings?.servicesDetailBookEnquiryButton ||
                      settings?.servicesDetailCtaLabelSecondary ||
                      "BOOK ENQUIRY"}
                  </Link>
                </div>
              </div>

              <div className="svc-block-visual">
                <div
                  className={`svc-img-wrapper ${
                    currentService?.glowClass || "purple-glow"
                  }`}
                  style={{
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <img
                    src={currentService?.imageUrl}
                    alt={currentService?.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. OTHER SERVICES QUICK GRID ================= */}
        <section
          className="svc-why-gdp"
          style={{
            background: "rgba(255,255,255,0.01)",
            padding: "100px 0",
          }}
        >
          <div className="container">
            <div
              className="svc-section-header"
              style={{ textAlign: "center", marginBottom: "60px" }}
            >
              <div className="cyber-label" style={{ justifyContent: "center" }}>
                {settings?.servicesDetailExploreOtherOptionsLabel ||
                  "EXPLORE OTHER OPTIONS"}
              </div>
              <h2
                className="section-title"
                style={{ fontSize: "32px", letterSpacing: "-1px" }}
              >
                {settings?.servicesDetailExploreOtherServicesLabel ||
                  "EXPLORE OTHER SERVICES"}
              </h2>
            </div>

            <div
              className="svc-why-blocks"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "30px",
                maxWidth: "1200px",
              }}
            >
              {otherServices.map((svc) => (
                <motion.div
                  key={svc._id || svc.key}
                  className="svc-why-block"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "35px 30px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "260px",
                  }}
                  whileHover={{
                    y: -5,
                    borderColor: "rgba(99, 75, 250, 0.4)",
                    background: "rgba(99, 75, 250, 0.03)",
                    boxShadow: "0 10px 30px rgba(99, 75, 250, 0.1)",
                  }}
                  onClick={() => navigate(`/services/${svc._id || svc.key}`)}
                >
                  <div>
                    <div
                      className="svc-why-block-title"
                      style={{
                        fontSize: "14px",
                        color: "var(--svc-green)",
                        marginBottom: "15px",
                      }}
                    >
                      {svc.title}
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.7",
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                      }}
                    >
                      {svc.description.substring(0, 100)}...
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      fontSize: "11px",
                      fontFamily: "var(--font-krona)",
                      color: "#fff",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    EXPLORE <span style={{ color: "var(--svc-green)" }}>→</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: "50px", textAlign: "center" }}>
              <Link
                to="/services"
                style={{
                  fontFamily: "var(--font-krona)",
                  fontSize: "12px",
                  color: "#634bfa",
                  textDecoration: "none",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                ← VIEW ALL SERVICES
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ServiceDetails;
