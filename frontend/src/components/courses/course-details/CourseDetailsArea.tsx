import React, { useState } from "react";
import { Link } from "react-router-dom";
import { type Program } from "../../../services/programService";
import { TranslatedContent } from "../../common/TranslatedContent";
import { usePriceFormatter } from "../../../hooks/usePriceFormatter";
import { motion, AnimatePresence } from "framer-motion";

interface ProgramDetailsAreaProps {
  program: Program;
}

const ProgramDetailsArea: React.FC<ProgramDetailsAreaProps> = ({ program }) => {
  const { formatPriceDirect } = usePriceFormatter();
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "faq">("overview");
  const [openCurriculumIndex, setOpenCurriculumIndex] = useState<number | null>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Map levels to reader-friendly tags
  const levelLabels: Record<string, string> = {
    beginner: "Beginner Friendly",
    intermediate: "Intermediate Level",
    advanced: "Advanced Masterclass",
    all_levels: "All Levels Welcome",
  };

  const levelTag = program.level ? levelLabels[program.level] || program.level : "All Levels";

  const curriculum = program.curriculum || [];
  const benefits = program.benefits || [];
  const faqs = program.faqs || [];

  return (
    <section className="program-details-section py-5">
      <style>{`
        .program-hero-card {
          background: linear-gradient(135deg, #0f0c20 0%, #15102a 100%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #ffffff;
          padding: 48px;
          margin-bottom: 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .program-hero-card::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 75, 250, 0.15) 0%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }
        .program-meta-badge {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
          padding: 8px 16px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .nav-tabs-custom {
          display: flex;
          gap: 12px;
          border-bottom: 2px solid #eef1ff;
          padding-bottom: 12px;
          margin-bottom: 30px;
        }
        .nav-link-custom {
          background: transparent;
          border: none;
          color: #6c757d;
          font-weight: 700;
          font-size: 1rem;
          padding: 8px 16px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .nav-link-custom.active {
          color: #5751e1;
        }
        .nav-link-custom.active::after {
          content: '';
          position: absolute;
          bottom: -14px;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #5751e1;
          border-radius: 3px;
        }
        .sidebar-sticky-card {
          position: sticky;
          top: 120px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #eaecf5;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          padding: 30px;
          overflow: hidden;
        }
        .curriculum-accordion-item {
          border: 1px solid #ebebf0;
          border-radius: 12px;
          margin-bottom: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .curriculum-accordion-item.open {
          border-color: #5751e133;
          box-shadow: 0 4px 15px rgba(87,81,225,0.06);
        }
        .curriculum-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 700;
          font-size: 1rem;
          color: #1a1a2e;
          text-align: left;
        }
        .curriculum-body {
          padding: 0 20px 16px 20px;
          color: #5a5e75;
          font-size: 0.95rem;
          line-height: 1.6;
          border-top: 1px solid #f4f4f6;
          background: #fdfdfd;
        }
        .benefit-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .benefit-icon {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>

      <div className="container position-relative z-1">
        {/* ================= HERO COMPONENT ================= */}
        <div className="program-hero-card">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7 position-relative z-2">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="program-meta-badge">
                  <i className="fas fa-music text-primary"></i>
                  <TranslatedContent>{program.DanceStyle || "Dance Style"}</TranslatedContent>
                </span>
                <span className="program-meta-badge">
                  <i className="fas fa-layer-group text-warning"></i>
                  {levelTag}
                </span>
                {program.duration && (
                  <span className="program-meta-badge">
                    <i className="fas fa-clock text-info"></i>
                    {program.duration} {program.durationUnit || "weeks"}
                  </span>
                )}
              </div>

              <h1 className="fw-900 text-white mb-3" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.2 }}>
                <TranslatedContent>{program.name}</TranslatedContent>
              </h1>

              <p className="lead text-white-50 opacity-80 mb-4" style={{ fontSize: "1.05rem", maxWidth: "600px" }}>
                <TranslatedContent>{program.description}</TranslatedContent>
              </p>

              <div className="d-flex align-items-center gap-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <i className="fas fa-star"></i>
                  </div>
                  <div>
                    <h6 className="text-white fw-bold mb-0">5.0 Star Rating</h6>
                    <span className="small text-white-50">from verified dancers</span>
                  </div>
                </div>
                {program.enrollmentCount !== undefined && (
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                      <i className="fas fa-user-friends"></i>
                    </div>
                    <div>
                      <h6 className="text-white fw-bold mb-0">{program.enrollmentCount}+ Enrolled</h6>
                      <span className="small text-white-50">Active Students</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-5 position-relative z-2">
              <div className="rounded-4 overflow-hidden shadow-lg border" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
                <img
                  src={program.image || "/assets/img/courses/course_default.jpg"}
                  alt="Program Media"
                  className="w-100 h-auto"
                  style={{ maxHeight: "320px", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= DETAILS GRID ================= */}
        <div className="row g-5">
          <div className="col-lg-8">
            {/* Custom Navigation Tabs */}
            <div className="nav-tabs-custom">
              <button
                className={`nav-link-custom ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              {curriculum.length > 0 && (
                <button
                  className={`nav-link-custom ${activeTab === "curriculum" ? "active" : ""}`}
                  onClick={() => setActiveTab("curriculum")}
                >
                  Curriculum ({curriculum.length})
                </button>
              )}
              {faqs.length > 0 && (
                <button
                  className={`nav-link-custom ${activeTab === "faq" ? "active" : ""}`}
                  onClick={() => setActiveTab("faq")}
                >
                  FAQ ({faqs.length})
                </button>
              )}
            </div>

            {/* TAB CONTENTS */}
            <div className="tab-content-area">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* About Section */}
                    <div className="glass-panel bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light mb-4">
                      <h4 className="fw-900 mb-4 text-dark">About This Program</h4>
                      <div className="text-muted" style={{ lineHeight: 1.8, fontSize: "1.02rem" }}>
                        <TranslatedContent>{program.description}</TranslatedContent>
                      </div>

                      {/* Video Preview If Available */}
                      {program.previewVideo && (
                        <div className="mt-4 pt-2">
                          <h5 className="fw-bold mb-3 text-dark">Watch Program Preview</h5>
                          <div className="rounded-4 overflow-hidden shadow border bg-black">
                            <video src={program.previewVideo} controls className="w-100" style={{ maxHeight: "400px" }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Benefits Section */}
                    {benefits.length > 0 && (
                      <div className="glass-panel bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light mb-4">
                        <h4 className="fw-900 mb-4 text-dark">What You'll Achieve</h4>
                        <div className="row g-3">
                          {benefits.map((benefit, i) => (
                            <div key={i} className="col-md-6">
                              <div className="benefit-item">
                                <span className="benefit-icon">
                                  <i className="fas fa-check"></i>
                                </span>
                                <span className="text-muted fw-semibold">
                                  <TranslatedContent>{benefit}</TranslatedContent>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "curriculum" && curriculum.length > 0 && (
                  <motion.div
                    key="curriculum"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="glass-panel bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light mb-4">
                      <h4 className="fw-900 mb-2 text-dark">Program Curriculum</h4>
                      <p className="text-muted mb-4">A complete week-by-week layout of your learning path.</p>

                      <div className="curriculum-accordion-list">
                        {curriculum
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((item, index) => {
                            const isOpen = openCurriculumIndex === index;
                            return (
                              <div key={index} className={`curriculum-accordion-item ${isOpen ? "open" : ""}`}>
                                <button
                                  className="curriculum-trigger"
                                  onClick={() => setOpenCurriculumIndex(isOpen ? null : index)}
                                >
                                  <span>
                                    <span className="text-primary me-2 fw-bold">Class {index + 1}:</span>
                                    <TranslatedContent>{item.title}</TranslatedContent>
                                  </span>
                                  <span className="text-muted small">
                                    <i className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                                  </span>
                                </button>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="curriculum-body"
                                    >
                                      {item.description ? (
                                        <TranslatedContent>{item.description}</TranslatedContent>
                                      ) : (
                                        "No details provided for this section."
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "faq" && faqs.length > 0 && (
                  <motion.div
                    key="faq"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="glass-panel bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light mb-4">
                      <h4 className="fw-900 mb-2 text-dark">Program FAQ</h4>
                      <p className="text-muted mb-4">Common questions specific to this dance program.</p>

                      <div className="faq-accordion-list">
                        {faqs.map((faqItem, index) => {
                          const isOpen = openFaqIndex === index;
                          return (
                            <div key={index} className={`curriculum-accordion-item ${isOpen ? "open" : ""}`}>
                              <button
                                className="curriculum-trigger"
                                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                              >
                                <span className="fw-bold">
                                  <TranslatedContent>{faqItem.question}</TranslatedContent>
                                </span>
                                <span className="text-muted small">
                                  <i className={`fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                                </span>
                              </button>
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="curriculum-body"
                                  >
                                    <TranslatedContent>{faqItem.answer}</TranslatedContent>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ================= SIDEBAR COMPONENT ================= */}
          <div className="col-lg-4">
            <div className="sidebar-sticky-card">
              {/* Pricing section */}
              <div className="text-center pb-4 border-bottom mb-4">
                <span className="text-muted fw-bold text-uppercase small tracking-wide">Investment</span>
                <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
                  <h2 className="fw-900 text-primary mb-0" style={{ fontSize: "2.4rem" }}>
                    {formatPriceDirect(program.discountPrice || program.price || 49)}
                  </h2>
                  {program.discountPrice && program.price && (
                    <del className="text-muted fw-bold" style={{ fontSize: "1.2rem" }}>
                      {formatPriceDirect(program.price)}
                    </del>
                  )}
                </div>
                {program.discountPrice && (
                  <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill small fw-bold mt-2">
                    Save {Math.round(((program.price! - program.discountPrice) / program.price!) * 100)}% Today
                  </span>
                )}
              </div>

              {/* Bullet Details */}
              <div className="py-3 mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-light rounded-3 text-primary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <i className="fas fa-layer-group"></i>
                  </div>
                  <div>
                    <span className="small text-muted d-block">Level</span>
                    <strong className="text-dark">{levelTag}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-light rounded-3 text-primary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <i className="fas fa-history"></i>
                  </div>
                  <div>
                    <span className="small text-muted d-block">Duration</span>
                    <strong className="text-dark">{program.duration || 4} {program.durationUnit || "weeks"}</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-light rounded-3 text-primary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div>
                    <span className="small text-muted d-block">Certification</span>
                    <strong className="text-dark">Official GDP Certificate</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light rounded-3 text-primary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                    <i className="fas fa-headset"></i>
                  </div>
                  <div>
                    <span className="small text-muted d-block">Live Support</span>
                    <strong className="text-dark">Dedicated Student Help</strong>
                  </div>
                </div>
              </div>

              {/* Main Call to Action */}
              <Link to="/membership" className="btn-neon-primary w-100 py-3 text-center mb-3 fw-bold d-block text-decoration-none" style={{ borderRadius: "12px" }}>
                GET ACCESS WITH MEMBERSHIP
              </Link>

              <Link to="/contact" className="btn btn-outline-secondary w-100 py-3 text-center fw-bold d-block text-decoration-none" style={{ borderRadius: "12px", border: "1px solid #ced4da" }}>
                ASK A QUESTION
              </Link>

              <div className="text-center mt-4">
                <p className="small text-muted m-0">
                  <i className="fas fa-shield-alt text-success me-1"></i>
                  30-Day Satisfaction Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramDetailsArea;
