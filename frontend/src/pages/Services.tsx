import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import { usePageContent, renderMultiLineHeroTitle } from "../hooks/usePageContent";
import {
  EXPLORE_PROGRAMS,
  SERVICES_MEGA_MENU,
} from "../lib/servicesMenu";

import "../styles/services.css";

const Services: React.FC = () => {
  const location = useLocation();
  const { content: pageContent, loaded } = usePageContent("services");
  const heroLines = renderMultiLineHeroTitle(pageContent, ["TRAIN.", "PERFORM.", "EVOLVE."]);
  const heroSubtitle =
    (pageContent.heroSubtitle as string) ||
    "Professional dance training designed for every performer.";

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
                <Link to="/contact" className="svc-btn-glow">
                  BOOK A TRIAL
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

        <section id="explore-programs" className="svc-explore-section">
          <div className="container">
            <motion.div
              className="svc-explore-header"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="svc-explore-badge">Discover GDP</span>
              <h2 className="svc-explore-title">
                What would you like to{" "}
                <span className="svc-explore-highlight">Explore</span> today?
              </h2>
            </motion.div>

            <div className="svc-explore-list">
              {EXPLORE_PROGRAMS.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <Link to={item.href} className="svc-explore-row">
                    <span className="svc-explore-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="svc-explore-icon">{item.icon}</span>
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

        {SERVICES_MEGA_MENU.map((group, groupIndex) => (
          <section
            key={group.label}
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
                  {groupIndex === 0 ? (
                    <>
                      Heal your body.{" "}
                      <span className="svc-explore-highlight">Learn to dance.</span>
                    </>
                  ) : (
                    <>
                      Get fit.{" "}
                      <span className="svc-explore-highlight">Dance it out.</span>
                    </>
                  )}
                </h2>
              </motion.div>

              <div className="svc-wellness-grid">
                {group.items.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                  >
                    <Link to="/contact" className="svc-wellness-card">
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
              <h2 className="svc-final-cta-title">START YOUR JOURNEY</h2>
              <Link to="/contact" className="svc-btn-glow">
                CONTACT US
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Services;
