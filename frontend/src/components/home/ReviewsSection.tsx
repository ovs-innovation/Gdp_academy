import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import LazyVideo from '../common/LazyVideo';

export type ClientReviewCard = {
  name: string;
  position: string;
  message: string;
  image: string;
  rating: number;
  headline?: string;
};

type VideoReview = {
  id: number | string;
  vid: string;
  img?: string;
  quote?: string;
};

interface ReviewsSectionProps {
  subtitle?: string;
  googleRating?: string;
  googleReviewCount?: string;
  reviews: ClientReviewCard[];
  videoTestimonials?: VideoReview[];
}

const renderStars = (rating: number) =>
  '★'.repeat(Math.min(5, Math.max(1, Math.round(rating))));

const truncate = (text: string, max = 140) =>
  text.length <= max ? text : `${text.slice(0, max).trim()}…`;

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  subtitle = 'Real stories from students, couples & performers who learned, celebrated & grew with GDP.',
  googleRating = '5.0',
  googleReviewCount = '(236)',
  reviews,
  videoTestimonials = [],
}) => {
  const reviewCountLabel = googleReviewCount.replace(/[()]/g, '').trim();
  const trackRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [activeDot, setActiveDot] = useState(0);

  const carouselItems = [
    { type: 'intro' as const, id: 'intro' },
    ...videoTestimonials.slice(0, 4).map((v, i) => ({
      type: 'video' as const,
      ...v,
      id: v.id ?? i,
      quote: v.quote ?? reviews[i % Math.max(reviews.length, 1)]?.message,
    })),
  ];

  const scrollCarousel = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.reviews-v3-carousel-item');
    const step = card ? card.offsetWidth + 16 : 280;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
    setActiveDot((prev) => {
      const max = Math.max(carouselItems.length - 1, 0);
      return Math.min(max, Math.max(0, prev + direction));
    });
  };

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="reviews-v3 section-padding" id="reviews">
      <div className="container">
        <header className="reviews-v3-header">
          <span className="reviews-v3-badge">
            <span className="reviews-v3-badge-icon" aria-hidden="true">♥</span>
            Our Community
          </span>
          <h2 className="reviews-v3-title">
            From Our <span className="gradient-text">Clients</span>
          </h2>
          <p className="reviews-v3-subtitle">{subtitle}</p>
          <div className="reviews-v3-divider" aria-hidden="true">
            <span />
            <span className="reviews-v3-divider-heart">♥</span>
            <span />
          </div>
        </header>

        <div className="reviews-v3-body">
        <div className="reviews-v3-cards">
          <motion.article
            className="reviews-v3-card reviews-v3-google"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="reviews-v3-google-top">
              <span className="reviews-v3-google-g">G</span>
              <span>Google Reviews</span>
            </div>
            <div className="reviews-v3-google-score">{googleRating}</div>
            <div className="reviews-v3-google-stars" aria-hidden="true">★★★★★</div>
            <p className="reviews-v3-google-meta">Based on {reviewCountLabel} reviews</p>
            <span className="reviews-v3-trusted-pill">★ Trusted by hundreds</span>
          </motion.article>

          {reviews.slice(0, 2).map((review, index) => {
            const isOpen = expanded[index];
            const showToggle = review.message.length > 140;
            return (
              <motion.article
                key={`${review.name}-${index}`}
                className="reviews-v3-card reviews-v3-quote"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <span className="reviews-v3-quote-mark" aria-hidden="true">&ldquo;</span>
                <div className="reviews-v3-quote-head">
                  <img src={review.image} alt={review.name} loading="lazy" />
                  <div>
                    <h4>{review.name}</h4>
                    <p>{review.position}</p>
                  </div>
                </div>
                <div className="reviews-v3-quote-stars">
                  {renderStars(review.rating)}
                  <span>a month ago</span>
                </div>
                <p className="reviews-v3-quote-text">
                  {isOpen ? review.message : truncate(review.message)}
                </p>
                {showToggle && (
                  <button
                    type="button"
                    className="reviews-v3-read-more"
                    onClick={() => toggleExpand(index)}
                  >
                    {isOpen ? 'Show less' : 'Read more'}
                  </button>
                )}
                <div className="reviews-v3-quote-actions" aria-hidden="true">
                  <span>♡</span>
                  <span>👍</span>
                </div>
              </motion.article>
            );
          })}
        </div>

        {carouselItems.length > 1 && (
          <div className="reviews-v3-carousel-section">
            <div className="reviews-v3-carousel-viewport">
              <button
                type="button"
                className="reviews-v3-carousel-btn reviews-v3-carousel-btn--prev"
                onClick={() => scrollCarousel(-1)}
                aria-label="Previous videos"
              >
                ‹
              </button>
              <button
                type="button"
                className="reviews-v3-carousel-btn reviews-v3-carousel-btn--next"
                onClick={() => scrollCarousel(1)}
                aria-label="Next videos"
              >
                ›
              </button>
              <div className="reviews-v3-carousel-track" ref={trackRef}>
                {carouselItems.map((item) =>
                  item.type === 'intro' ? (
                    <div key="intro" className="reviews-v3-carousel-item reviews-v3-intro-card">
                      <div className="reviews-v3-intro-bg" />
                      <p className="reviews-v3-intro-label">Client Stories</p>
                      <h3>Garima Dance<br />Productions</h3>
                      <div className="reviews-v3-play-btn" aria-hidden="true">
                        <span>▶</span>
                      </div>
                      <span className="reviews-v3-yt-badge">YouTube</span>
                    </div>
                  ) : (
                    <div key={item.id} className="reviews-v3-carousel-item reviews-v3-video-card">
                      <LazyVideo
                        src={item.vid}
                        className="reviews-v3-video-media"
                        scale={1.1}
                      />
                      <div className="reviews-v3-video-shade" />
                      <div className="reviews-v3-play-btn reviews-v3-play-btn--sm" aria-hidden="true">
                        <span>▶</span>
                      </div>
                      {item.quote && (
                        <div className="reviews-v3-video-quote">
                          <span>&ldquo;</span>
                          <p>{truncate(item.quote, 72)}</p>
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="reviews-v3-dots" role="tablist" aria-label="Video carousel">
              {carouselItems.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeDot === i}
                  className={`reviews-v3-dot${activeDot === i ? ' is-active' : ''}`}
                  onClick={() => {
                    const track = trackRef.current;
                    const card = track?.querySelector<HTMLElement>('.reviews-v3-carousel-item');
                    const step = card ? card.offsetWidth + 16 : 280;
                    track?.scrollTo({ left: i * step, behavior: 'smooth' });
                    setActiveDot(i);
                  }}
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
