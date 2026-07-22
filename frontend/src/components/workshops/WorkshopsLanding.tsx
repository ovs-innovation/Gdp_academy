import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LazyImage from '../common/LazyImage';
import type { WorkshopsPageContent } from '../../lib/workshopsPageCms';

type Props = {
  content: WorkshopsPageContent;
};

function useOfferCountdown(endIso: string, enabled: boolean) {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!enabled) {
      setLabel('');
      return;
    }
    const end = endIso
      ? new Date(endIso).getTime()
      : Date.now() + 3 * 24 * 60 * 60 * 1000;
    if (Number.isNaN(end)) return;

    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      if (diff <= 0) {
        setLabel('Offer ended');
        return;
      }
      const days = Math.floor(diff / 86400000);
      if (days >= 1) {
        setLabel(`Offer ends in ${days} day(s)`);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setLabel(`Offer ends in ${h}h ${m}m`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endIso, enabled]);

  return label;
}

const WorkshopsLanding: React.FC<Props> = ({ content }) => {
  const [descOpen, setDescOpen] = useState(false);
  const countdownLabel = useOfferCountdown(content.countdownEnd, content.showCountdown);

  const stars = useMemo(
    () =>
      '★'.repeat(
        Math.min(5, Math.max(1, Math.round(parseFloat(content.socialProofStars) || 5))),
      ),
    [content.socialProofStars],
  );

  const showReadMore = content.featuredDescription.length > 160;
  const shortDesc = showReadMore && !descOpen
    ? `${content.featuredDescription.slice(0, 160).trim()}…`
    : content.featuredDescription;

  return (
    <div className="wsh-landing">
      {content.offerBannerText && (
        <div className="wsh-offer-bar">
          <span className="prog-cyber-label__dot" aria-hidden="true" />
          {content.offerBannerText}
          {countdownLabel && <span className="wsh-offer-timer">{countdownLabel}</span>}
        </div>
      )}

      {/* Featured workshop */}
      <section className="wsh-featured section-padding">
        <div className="container">
          <motion.div
            className="wsh-featured-card glass-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="wsh-featured-media">
              <LazyImage src={content.featuredImage} alt={content.featuredTitle} />
              {content.featuredDiscount && (
                <span className="wsh-discount-tag">{content.featuredDiscount} OFF</span>
              )}
            </div>

            <div className="wsh-featured-body">
              <div className="prog-cyber-label wsh-label">
                <span className="prog-cyber-label__dot" />
                {content.featuredLabel}
              </div>

              <h1 className="wsh-featured-title">{content.featuredTitle}</h1>

              <div className="wsh-badges">
                {content.featuredBadges.map((badge) => (
                  <span key={badge} className="level-badge">{badge}</span>
                ))}
              </div>

              <p className="wsh-featured-desc">{shortDesc}</p>
              {showReadMore && (
                <button
                  type="button"
                  className="wsh-readmore"
                  onClick={() => setDescOpen((v) => !v)}
                >
                  {descOpen ? 'Show less' : 'Read more'}
                </button>
              )}

              <ul className="wsh-perks">
                {content.featuredPerks.slice(0, 6).map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>

              <div className="wsh-price-block">
                <div className="wsh-prices">
                  <span className="wsh-price-sale">{content.featuredPrice}</span>
                  {content.featuredOriginalPrice && (
                    <span className="wsh-price-old">{content.featuredOriginalPrice}</span>
                  )}
                </div>
                <Link to={content.ctaLink} className="prog-btn-glow wsh-cta">
                  {content.ctaText}
                </Link>
              </div>

              <div className="wsh-proof">
                <span className="wsh-stars" aria-hidden="true">{stars}</span>
                <span>{content.socialProofReviews}</span>
                <span className="wsh-proof-dot">·</span>
                <span>{content.trustedByText}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value props */}
      <section className="wsh-values section-padding">
        <div className="container">
          <header className="wsh-section-head">
            <h2 className="section-title">
              {content.valuesSectionTitle}{' '}
              <span className="gradient-text">{content.valuesSectionHighlight}</span>
            </h2>
          </header>
          <div className="wsh-values-grid">
            {content.valueBlocks.map((block, i) => (
              <motion.article
                key={`${block.eyebrow}-${block.title}`}
                className="wsh-value-card glass-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="wsh-value-num">{String(i + 1).padStart(2, '0')}</span>
                <p className="wsh-value-eye">{block.eyebrow}</p>
                <h3 className="wsh-value-title">{block.title}</h3>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="wsh-reviews section-padding">
        <div className="container">
          <header className="wsh-section-head">
            <div className="prog-cyber-label wsh-label">
              <span className="prog-cyber-label__dot" />
              {content.testimonialsSubheading}
            </div>
            <h2 className="section-title">{content.testimonialsHeading}</h2>
            <p className="section-desc">{content.trustTitle}</p>
          </header>

          <div className="wsh-reviews-grid">
            {content.testimonials.map((t) => (
              <article key={t.name} className="wsh-review-card glass-card">
                <span className="wsh-stars" aria-hidden="true">{stars}</span>
                <p className="wsh-review-quote">&ldquo;{t.quote}&rdquo;</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="wsh-about section-padding">
        <div className="container wsh-about-grid">
          <div className="wsh-about-copy">
            <div className="prog-cyber-label wsh-label">
              <span className="prog-cyber-label__dot" />
              {content.aboutLabel}
            </div>
            <h2 className="section-title">{content.aboutTitle}</h2>
            <p className="section-desc wsh-about-text">{content.aboutText}</p>
            <ul className="wsh-institute-tags">
              {content.instituteTags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <div className="wsh-about-stats">
            {content.aboutStats.map((stat) => (
              <div key={stat.label} className="wsh-stat glass-card">
                <span className="wsh-stat-value gradient-text">{stat.value}</span>
                <span className="wsh-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="wsh-sticky-cta">
        <div className="container wsh-sticky-inner">
          <div className="wsh-sticky-price">
            <strong>{content.featuredPrice}</strong>
            {content.featuredOriginalPrice && (
              <span>{content.featuredOriginalPrice}</span>
            )}
          </div>
          <Link to={content.ctaLink} className="prog-btn-glow">
            {content.ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkshopsLanding;
