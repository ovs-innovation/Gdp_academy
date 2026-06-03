import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";

import { getCMSBySection, type CMSContent } from "../services/cmsService";
import {
  getSiteSettings,
  type SiteSettings,
} from "../services/settingsService";
import { usePageContent, renderMultiLineHeroTitle } from "../hooks/usePageContent";

import "../styles/services.css";

const Services: React.FC = () => {
  const { content: pageContent } = usePageContent("services");
  const heroLines = renderMultiLineHeroTitle(pageContent, ["TRAIN.", "PERFORM.", "EVOLVE."]);
  const heroSubtitle =
    (pageContent.heroSubtitle as string) ||
    "Professional dance training designed for every performer.";
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [cmsServices, setCmsServices] = useState<CMSContent[]>([]);

  useEffect(() => {
    getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings(null));
    getCMSBySection("services")
      .then((data) => setCmsServices(data || []))
      .catch((err) => {
        console.error("Failed to fetch CMS services:", err);
        setCmsServices([]);
      });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
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
      transition: { staggerChildren: 0.15 },
    },
  };

  const getLocalizedValue = (
    val: string | { en: string; [key: string]: string } | undefined | null,
    fallback: string,
  ): string => {
    if (!val) return fallback;
    if (typeof val === "string") return val;
    return val.en || Object.values(val)[0] || fallback;
  };

  const defaultServices = useMemo(
    () => [
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
    ],
    [],
  );

  const servicesToRender = useMemo(() => {
    return cmsServices && cmsServices.length > 0
      ? cmsServices.map((svc, index) => {
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
  }, [cmsServices, defaultServices]);

  return (
    <Layout>
      <SEO pageTitle="Services" />
      <div className="services-page-wrapper">
        <section className="svc-hero-section">
          <div className="svc-hero-bg"></div>
          <div className="svc-hero-smoke"></div>

          <div className="container" style={{ zIndex: 2 }}>
            <motion.div
              className="svc-hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 className="svc-hero-title" variants={fadeInUp}>
                <span>{heroLines[0]}</span>
                <span>{heroLines[1]}</span>
                <span>{heroLines[2]}</span>
              </motion.h1>

              <motion.p className="svc-hero-subtitle" variants={fadeInUp}>
                {heroSubtitle}
              </motion.p>

              <motion.div variants={fadeInUp}>
                <Link to="/contact" className="svc-btn-glow">
                  BOOK A TRIAL
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="svc-detailed-section">
          <div className="container">
            <div
              className="svc-section-header"
              style={{ textAlign: "center", marginBottom: "80px" }}
            >
              <div className="cyber-label" style={{ justifyContent: "center" }}>
                {settings?.servicesHeroLabel || "OUR PROGRAMS"}
              </div>
              <h2 className="section-title">
                {settings?.servicesTitle || "CORE SERVICES"}
              </h2>
            </div>

            <div className="svc-blocks-container">
              {servicesToRender.map((svc, index) => (
                <motion.div
                  key={svc._id || svc.key || index}
                  className={`svc-block-row ${index % 2 !== 0 ? "reverse" : ""}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="svc-block-content">
                    <div className="svc-block-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                    <ul className="svc-feature-list">
                      {svc.features.map((feature: string, fIdx: number) => (
                        <li key={fIdx}>
                          <span>✦</span> {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/services/${svc._id || svc.key}`}
                      className="svc-btn-glow"
                      style={{
                        padding: "16px 32px",
                        fontSize: "11px",
                        marginTop: "10px",
                      }}
                    >
                      EXPLORE PROGRAM
                    </Link>
                  </div>

                  <div className="svc-block-visual">
                    <div className={`svc-img-wrapper ${svc.glowClass}`}>
                      <img
                        src={svc.imageUrl}
                        alt={`${svc.title} at GDP Studio`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="svc-stats-strip">
          <div className="container">
            <motion.div
              className="svc-stats-flex"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">5000+</div>
                <div className="svc-stat-text">Students</div>
              </motion.div>

              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">100+</div>
                <div className="svc-stat-text">Performances</div>
              </motion.div>

              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">20+</div>
                <div className="svc-stat-text">Trainers</div>
              </motion.div>

              <motion.div className="svc-stat-item" variants={fadeInUp}>
                <div className="svc-stat-num">ALL</div>
                <div className="svc-stat-text">Age Groups</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="svc-why-gdp">
          <div className="container">
            <motion.h2
              className="svc-why-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              WE BUILD PERFORMERS.
            </motion.h2>

            <motion.div
              className="svc-why-blocks"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div className="svc-why-block" variants={fadeInUp}>
                <div className="svc-why-block-title">Creative Environment</div>
                <div className="svc-why-block-text">
                  Train in aesthetic, high-energy studios built to inspire
                  freedom and individual expression.
                </div>
              </motion.div>

              <motion.div className="svc-why-block" variants={fadeInUp}>
                <div className="svc-why-block-title">Real Stage Experience</div>
                <div className="svc-why-block-text">
                  Step beyond the studio. Our programs are engineered to prepare
                  you for actual industry stages.
                </div>
              </motion.div>

              <motion.div className="svc-why-block" variants={fadeInUp}>
                <div className="svc-why-block-title">Industry Mentorship</div>
                <div className="svc-why-block-text">
                  Learn directly from working professionals who bring real-world
                  choreography and battle experience.
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="svc-final-cta">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="svc-final-cta-title">START YOUR JOURNEY</h2>
              <Link to="/signup" className="svc-btn-glow">
                JOIN THE STUDIO
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Services;
