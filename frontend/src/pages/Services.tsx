import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import { usePageContent, renderMultiLineHeroTitle } from "../hooks/usePageContent";
import {
  EXPLORE_PROGRAMS,
  SERVICES_MEGA_MENU,
  getServiceIcon,
} from "../lib/servicesMenu";

import "../styles/services.css";

const DEFAULT_STATS = [
  { value: "5000+", label: "Students" },
  { value: "100+", label: "Performances" },
  { value: "20+", label: "Trainers" },
  { value: "ALL", label: "Age Groups" },
];

const Services: React.FC = () => {
  const location = useLocation();
  const { content: pageContent, loaded } = usePageContent("services");
  const heroLines = renderMultiLineHeroTitle(pageContent, ["TRAIN.", "PERFORM.", "EVOLVE."]);
  const heroSubtitle =
    (pageContent.heroSubtitle as string) ||
    "Professional dance training designed for every performer.";
  const heroCtaText = (pageContent.heroCtaText as string) || "BOOK A TRIAL";
  const heroCtaUrl = (pageContent.heroCtaUrl as string) || "/contact";

  const stats =
    Array.isArray(pageContent.stats) && pageContent.stats.length > 0
      ? pageContent.stats
      : DEFAULT_STATS;

  const exploreBadge = (pageContent.exploreBadge as string) || "Discover GDP";
  const exploreTitle =
    (pageContent.exploreTitle as string) || "What would you like to";
  const exploreHighlight = (pageContent.exploreHighlight as string) || "Explore";

  const explorePrograms =
    Array.isArray(pageContent.explorePrograms) && pageContent.explorePrograms.length > 0
      ? pageContent.explorePrograms
      : EXPLORE_PROGRAMS.map(({ key, title, subtitle, href }) => ({
          key,
          title,
          subtitle,
          href,
        }));

  const wellnessGroups =
    Array.isArray(pageContent.wellnessGroups) && pageContent.wellnessGroups.length > 0
      ? pageContent.wellnessGroups
      : SERVICES_MEGA_MENU.map((group, groupIndex) => ({
          label: group.label,
          sectionId: group.sectionId,
          title: groupIndex === 0 ? "Heal your body." : "Get fit.",
          highlight: groupIndex === 0 ? "Learn to dance." : "Dance it out.",
          items: group.items,
        }));

  const finalCtaTitle = (pageContent.finalCtaTitle as string) || "START YOUR JOURNEY";
  const finalCtaButtonText =
    (pageContent.finalCtaButtonText as string) || "CONTACT US";
  const finalCtaUrl = (pageContent.finalCtaUrl as string) || "/contact";

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }, 120);
    return () => window.clearTimeout(timer);
  }, [location.hash]);

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

  return (
    <Layout>
      <SEO pageTitle="Services" />
      <div className="services-page-wrapper">
        <section className="svc-hero-section">
          <div className="svc-hero-bg" />
          <div className="svc-hero-smoke" />

          <div className="container" style={{ zIndex: 2 }}>
            <motion.div
              className="svc-hero-content"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 className="svc-hero-title" variants={fadeInUp}>
                {!loaded ? (
                  <>
                    <span className="home-skel" style={{ display: "block", height: 48, width: 220, margin: "0 auto 10px" }} />
                    <span className="home-skel" style={{ display: "block", height: 48, width: 260, margin: "0 auto 10px" }} />
                    <span className="home-skel" style={{ display: "block", height: 48, width: 200, margin: "0 auto" }} />
                  </>
                ) : (
                  <>
                    <span>{heroLines[0]}</span>
                    <span>{heroLines[1]}</span>
                    <span>{heroLines[2]}</span>
                  </>
                )}
              </motion.h1>

              <motion.p className="svc-hero-subtitle" variants={fadeInUp}>
                {!loaded ? (
                  <span className="home-skel" style={{ display: "block", height: 16, width: "70%", margin: "0 auto" }} />
                ) : (
                  heroSubtitle
                )}
              </motion.p>

              <motion.div variants={fadeInUp}>
                <Link to={heroCtaUrl} className="svc-btn-glow">
                  {heroCtaText}
                </Link>
              </motion.div>
            </motion.div>
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
              {stats.map((stat: { value?: string; label?: string }) => (
                <motion.div
                  key={`${stat.value}-${stat.label}`}
                  className="svc-stat-item"
                  variants={fadeInUp}
                >
                  <div className="svc-stat-num">{stat.value}</div>
                  <div className="svc-stat-text">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="explore-programs" className="svc-explore-section">
          <div className="container">
            <motion.div
              className="svc-explore-header"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="svc-explore-badge">{exploreBadge}</span>
              <h2 className="svc-explore-title">
                {exploreTitle}{" "}
                <span className="svc-explore-highlight">{exploreHighlight}</span> today?
              </h2>
            </motion.div>

            <div className="svc-explore-list">
              {explorePrograms.map((item: any, index: number) => (
                <motion.div
                  key={item.key || item.title || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <Link to={item.href || "/contact"} className="svc-explore-row">
                    <span className="svc-explore-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="svc-explore-icon">
                      {getServiceIcon({ key: item.key, title: item.title }) ||
                        EXPLORE_PROGRAMS.find((p) => p.key === item.key)?.icon ||
                        null}
                    </span>
                    <div className="svc-explore-copy">
                      <h3>{item.title}</h3>
                      <p>{item.subtitle}</p>
                    </div>
                    <span className="svc-explore-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {wellnessGroups.map((group: any) => (
          <section
            key={group.sectionId || group.label}
            id={group.sectionId}
            className="svc-wellness-section section-padding"
          >
            <div className="container">
              <motion.div
                className="svc-explore-header"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <span className="svc-explore-badge">{group.label}</span>
                <h2 className="svc-explore-title">
                  {group.title}{" "}
                  {group.highlight ? (
                    <span className="svc-explore-highlight">{group.highlight}</span>
                  ) : null}
                </h2>
              </motion.div>

              <div className="svc-wellness-grid">
                {(group.items || []).map((item: any, index: number) => (
                  <motion.div
                    key={item.title || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                  >
                    <Link to={item.href || "/contact"} className="svc-wellness-card">
                      {item.image ? (
                        <img src={item.image} alt="" className="svc-wellness-card-img" />
                      ) : null}
                      <div className="svc-wellness-card-body">
                        <h3>{item.title}</h3>
                        {item.subtitle ? (
                          <p className="svc-wellness-dept">{item.subtitle}</p>
                        ) : null}
                        {item.tagline ? (
                          <p className="svc-wellness-tagline">{item.tagline}</p>
                        ) : null}
                        <span className="svc-wellness-link">Get in touch →</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section className="svc-final-cta">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="svc-final-cta-title">{finalCtaTitle}</h2>
              <Link to={finalCtaUrl} className="svc-btn-glow">
                {finalCtaButtonText}
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Services;
