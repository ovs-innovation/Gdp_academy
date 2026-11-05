import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import SEO from "../components/SEO";
import { ServiceDetailIcon } from "../components/services/ServiceDetailIcons";
import { useSiteData } from "../contexts/SiteDataContext";
import { useEnquiryPopup } from "../contexts/EnquiryPopupContext";
import { programFromLabel } from "../lib/trialEnquiry";
import {
  buildServiceDetail,
  cmsContentToServiceDetail,
  findCmsServiceBySlug,
  getHardcodedService,
} from "../lib/serviceDetail";
import { getServiceTheme } from "../lib/serviceThemes";
import { buildWhatsAppUrl } from "../utils/whatsapp";
import { getCMSByKey } from "../services/cmsService";
import "../styles/services.css";

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { appSettings: settings, servicesCms, ready: siteDataReady } = useSiteData();
  const { openEnquiry } = useEnquiryPopup();
  const [remoteCms, setRemoteCms] = useState<ReturnType<typeof cmsContentToServiceDetail> | null>(
    null,
  );
  const [lookupDone, setLookupDone] = useState(false);

  const cmsFromList = slug ? findCmsServiceBySlug(servicesCms, slug) : undefined;
  const cmsPartial =
    (cmsFromList ? cmsContentToServiceDetail(cmsFromList) : null) || remoteCms;

  const service = useMemo(() => {
    if (!slug || (!cmsPartial && !getHardcodedService(slug))) return null;
    return buildServiceDetail(slug, cmsPartial, getHardcodedService(slug));
  }, [slug, cmsPartial]);

  const theme = useMemo(
    () => getServiceTheme(slug || "dance", service?.theme),
    [slug, service?.theme],
  );

  const themeStyle = {
    "--svcd-accent": theme.accent,
    "--svcd-accent-rgb": theme.accentRgb,
    "--svcd-accent-soft": theme.accentSoft,
  } as React.CSSProperties;

  useEffect(() => {
    setRemoteCms(null);
    setLookupDone(false);
  }, [slug]);

  useEffect(() => {
    if (!slug || cmsFromList || getHardcodedService(slug)) {
      setLookupDone(true);
      return;
    }
    if (!siteDataReady) return;

    let cancelled = false;
    getCMSByKey(slug)
      .then((cms) => {
        if (!cancelled) setRemoteCms(cmsContentToServiceDetail(cms));
      })
      .catch(() => {
        if (!cancelled) setRemoteCms(null);
      })
      .finally(() => {
        if (!cancelled) setLookupDone(true);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, cmsFromList, siteDataReady]);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [slug]);

  if (!service && (!siteDataReady || !lookupDone)) {
    return (
      <Layout>
        <div
          className="services-page-wrapper svcd-container"
          style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading…</p>
        </div>
      </Layout>
    );
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const gallery =
    service.gallery && service.gallery.length > 1
      ? service.gallery.filter((url) => url !== service.image)
      : [];

  const openServiceEnquiry = (purpose: "trial" | "service" = "service") => {
    openEnquiry({
      purpose,
      program: programFromLabel(slug, service.title),
      topic: service.title,
    });
  };

  return (
    <Layout>
      <SEO pageTitle={service.title} description={service.description} path={`/services/${slug}`} />
      <div
        className={`services-page-wrapper svcd-container svcd-theme-${theme.id}`}
        style={themeStyle}
      >
        <section className="svcd-hero-section">
          <div className="svcd-hero-theme-bg" style={{ background: theme.heroGradient }} />
          <div className="svcd-hero-overlay-grid" />
          <div className="container">
            <div className="svcd-hero-split-grid">
              <motion.div
                className="svcd-hero-content"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link to="/services" className="svcd-back-link">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to Services
                </Link>
                <div className="svcd-hero-badge">
                  <span className="svcd-badge-text">{service.heroBadge}</span>
                </div>
                <h1 className="svcd-title">{service.title}</h1>
                <p className="svcd-subtitle">{service.tagline}</p>
                <div className="svcd-hero-pills">
                  {service.features.slice(0, 4).map((feat) => (
                    <span key={feat} className="svcd-hero-pill">
                      {feat}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="svc-btn-glow svcd-hero-cta"
                  onClick={() => openServiceEnquiry(/trial/i.test(service.ctaLabel || "") ? "trial" : "service")}
                >
                  {service.ctaLabel}
                </button>
              </motion.div>

              <motion.div
                className="svcd-hero-showcase"
                initial={{ opacity: 0, scale: 0.94, x: 40 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svcd-showcase-glow" />
                <div
                  className={`svcd-showcase-frame${
                    service.youtubeId && isPlayingVideo ? " svcd-showcase-frame--video" : ""
                  }`}
                >
                  {service.youtubeId && isPlayingVideo ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${service.youtubeId}?autoplay=1&rel=0`}
                      title={service.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="svcd-showcase-iframe"
                    />
                  ) : (
                    <div
                      className={`svcd-showcase-img-wrap${service.youtubeId ? " is-clickable" : ""}`}
                      onClick={service.youtubeId ? () => setIsPlayingVideo(true) : undefined}
                      role={service.youtubeId ? "button" : undefined}
                      tabIndex={service.youtubeId ? 0 : undefined}
                      onKeyDown={
                        service.youtubeId
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") setIsPlayingVideo(true);
                            }
                          : undefined
                      }
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="svcd-showcase-img"
                        decoding="async"
                        fetchPriority="high"
                      />
                      {service.youtubeId ? (
                        <div className="svcd-play-overlay">
                          <div className="svcd-play-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                            </svg>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {service.stats && service.stats.length > 0 ? (
          <section className="svcd-stats-section">
            <div className="container">
              <div className="svcd-stats-grid">
                {service.stats.map((item, i) => (
                  <div key={i} className="svcd-stat-col">
                    <span className="svcd-stat-number">{item.value}</span>
                    <span className="svcd-stat-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section className="svcd-gallery-strip">
            <div className="container">
              <div className="svcd-gallery-grid">
                {gallery.map((url) => (
                  <div key={url} className="svcd-gallery-item">
                    <img src={url} alt="" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="svcd-overview-section section-padding">
          <div className="container">
            <div className="svcd-overview-grid">
              <div className="svcd-desc-col">
                <span className="svcd-section-badge">ABOUT THIS PROGRAM</span>
                <h2 className="svcd-section-title">
                  Why Choose <span className="svcd-accent-text">{service.title}</span>
                </h2>
                <p className="svcd-desc-text">{service.description}</p>
              </div>

              <div className="svcd-bento-grid">
                {(service.whyUs || []).map((feat, i) => (
                  <motion.div
                    key={`${feat.title}-${i}`}
                    className="svcd-bento-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="svcd-bento-card-glow" />
                    <div className="svcd-bento-icon">
                      <ServiceDetailIcon iconKey={feat.iconKey} />
                    </div>
                    <h4>{feat.title}</h4>
                    <p>{feat.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="svcd-process-section section-padding">
          <div className="container">
            <div className="svcd-center-header">
              <span className="svcd-section-badge">HOW IT WORKS</span>
              <h2 className="svcd-section-title">{service.processTitle}</h2>
              <p className="svcd-section-desc">{service.processSubtitle}</p>
            </div>

            <div className="svcd-alternating-rows">
              {(service.processSteps || []).map((step, i) => (
                <div key={step.num} className={`svcd-process-row${i % 2 !== 0 ? " reverse" : ""}`}>
                  <div className="svcd-process-text-col">
                    <div className="svcd-process-num">{step.num}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  <div className="svcd-process-visual-col">
                    <div className="svcd-visual-container">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="svcd-process-img"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="svcd-visual-glow" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="enquire" className="svcd-booking-section section-padding">
          <div className="container">
            <div className="svcd-booking-grid">
              <div className="svcd-booking-info">
                <span className="svcd-section-badge">GET STARTED</span>
                <h2 className="svcd-section-title svcd-booking-title">{service.bookingTitle}</h2>
                <p className="svcd-booking-desc">{service.bookingDesc}</p>
                <a
                  href={buildWhatsAppUrl(settings?.whatsappNumber || "7838416907")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="svcd-whatsapp-btn"
                >
                  Chat on WhatsApp
                </a>
              </div>

              <motion.div
                className="svcd-form-card"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="svcd-form-glow" />
                <h3>Enquire about {service.title}</h3>
                <p>Opens the same trial form, with {service.title} already selected.</p>
                <button type="button" className="svcd-submit-btn" onClick={() => openServiceEnquiry("trial")}>
                  Book a free trial
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {service.faq && service.faq.length > 0 ? (
          <section className="svcd-faq-section section-padding">
            <div className="container">
              <div className="svcd-center-header">
                <span className="svcd-section-badge">FAQ</span>
                <h2 className="svcd-section-title">
                  Questions About <span className="svcd-accent-text">{service.title}</span>
                </h2>
              </div>
              <div className="faq-v3-list svcd-faq-list">
                {service.faq.map((item, i) => (
                  <div key={item.q} className={`faq-v3-item${openFaq === i ? " is-open" : ""}`}>
                    <button
                      type="button"
                      className="faq-v3-question"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="faq-v3-num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="faq-v3-q">{item.q}</span>
                      <span className="faq-v3-icon">{openFaq === i ? "−" : "+"}</span>
                    </button>
                    <div className="faq-v3-answer">
                      <div className="faq-v3-answer-inner">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="svc-final-cta">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="svc-final-cta-title">{service.finalCtaTitle}</h2>
              <Link to="/services" className="svc-btn-glow svcd-final-cta-btn">
                VIEW ALL SERVICES
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

    </Layout>
  );
};

export default ServiceDetail;
