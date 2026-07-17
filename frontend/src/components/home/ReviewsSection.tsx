import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsAutoPausedRef = useRef(false);
  const videoAutoPausedRef = useRef(false);
  const resumeCardsAutoTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const resumeVideoAutoTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [activeCardDot, setActiveCardDot] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

  const textReviewCards = useMemo(
    () => [{ type: 'google' as const, id: 'google' }, ...reviews.slice(0, 2).map((r, i) => ({ type: 'quote' as const, id: `${r.name}-${i}`, review: r, index: i }))],
    [reviews],
  );

  const carouselItems = useMemo(
    () => [
      { type: 'intro' as const, id: 'intro' },
      ...videoTestimonials.slice(0, 4).map((v, i) => ({
        type: 'video' as const,
        ...v,
        id: v.id ?? i,
        quote: v.quote ?? reviews[i % Math.max(reviews.length, 1)]?.message,
      })),
    ],
    [videoTestimonials, reviews],
  );

  const getCardsStep = useCallback(() => {
    const track = cardsTrackRef.current;
    const card = track?.querySelector<HTMLElement>('.reviews-v3-card');
    return card ? card.offsetWidth + 16 : 300;
  }, []);

  const scrollToCardIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const track = cardsTrackRef.current;
      if (!track) return;
      const step = getCardsStep();
      const maxIndex = Math.max(textReviewCards.length - 1, 0);
      const nextIndex = Math.min(maxIndex, Math.max(0, index));
      track.scrollTo({ left: nextIndex * step, behavior });
      setActiveCardDot(nextIndex);
    },
    [textReviewCards.length, getCardsStep],
  );

  const pauseCardsAutoBriefly = useCallback((ms = 5000) => {
    cardsAutoPausedRef.current = true;
    if (resumeCardsAutoTimerRef.current) clearTimeout(resumeCardsAutoTimerRef.current);
    resumeCardsAutoTimerRef.current = setTimeout(() => {
      cardsAutoPausedRef.current = false;
    }, ms);
  }, []);

  const getCarouselStep = useCallback(() => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('.reviews-v3-carousel-item');
    return card ? card.offsetWidth + 16 : 280;
  }, []);

  const scrollToCarouselIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const track = trackRef.current;
      if (!track) return;
      const step = getCarouselStep();
      const maxIndex = Math.max(carouselItems.length - 1, 0);
      const nextIndex = Math.min(maxIndex, Math.max(0, index));
      track.scrollTo({ left: nextIndex * step, behavior });
      setActiveDot(nextIndex);
    },
    [carouselItems.length, getCarouselStep],
  );

  const pauseVideoAutoBriefly = useCallback((ms = 5000) => {
    videoAutoPausedRef.current = true;
    if (resumeVideoAutoTimerRef.current) clearTimeout(resumeVideoAutoTimerRef.current);
    resumeVideoAutoTimerRef.current = setTimeout(() => {
      videoAutoPausedRef.current = false;
    }, ms);
  }, []);

  const scrollCarousel = (direction: -1 | 1) => {
    pauseVideoAutoBriefly();
    scrollToCarouselIndex(activeDot + direction);
  };

  useEffect(() => {
    const track = cardsTrackRef.current;
    if (!track || textReviewCards.length <= 1) return;

    const syncDotFromScroll = () => {
      const step = getCardsStep();
      if (step <= 0) return;
      const index = Math.round(track.scrollLeft / step);
      setActiveCardDot(Math.min(textReviewCards.length - 1, Math.max(0, index)));
    };

    track.addEventListener('scroll', syncDotFromScroll, { passive: true });
    return () => track.removeEventListener('scroll', syncDotFromScroll);
  }, [textReviewCards.length, getCardsStep]);

  useEffect(() => {
    if (textReviewCards.length <= 1) return;
    if (typeof window === 'undefined') return;

    const mobileQuery = window.matchMedia('(max-width: 992px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let intervalId: ReturnType<typeof setInterval> | undefined;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const pauseAuto = () => {
      cardsAutoPausedRef.current = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    };

    const resumeAuto = (delayMs = 3500) => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        cardsAutoPausedRef.current = false;
      }, delayMs);
    };

    const advance = () => {
      if (cardsAutoPausedRef.current || !mobileQuery.matches || reducedMotion.matches) return;

      const track = cardsTrackRef.current;
      if (!track) return;

      const step = getCardsStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atEnd = track.scrollLeft >= maxScroll - 8;

      if (atEnd) {
        scrollToCardIndex(0);
      } else {
        const nextIndex = Math.min(
          textReviewCards.length - 1,
          Math.round(track.scrollLeft / step) + 1,
        );
        scrollToCardIndex(nextIndex);
      }
    };

    const startAuto = () => {
      if (!mobileQuery.matches || reducedMotion.matches) return;
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(advance, 4500);
    };

    const stopAuto = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = undefined;
    };

    const onMobileChange = () => {
      cardsAutoPausedRef.current = false;
      stopAuto();
      startAuto();
    };

    startAuto();
    mobileQuery.addEventListener('change', onMobileChange);
    reducedMotion.addEventListener('change', onMobileChange);

    const track = cardsTrackRef.current;
    const onTouchEnd = () => resumeAuto();

    track?.addEventListener('touchstart', pauseAuto, { passive: true });
    track?.addEventListener('touchend', onTouchEnd, { passive: true });
    track?.addEventListener('pointerdown', pauseAuto);

    return () => {
      stopAuto();
      if (resumeTimer) clearTimeout(resumeTimer);
      if (resumeCardsAutoTimerRef.current) clearTimeout(resumeCardsAutoTimerRef.current);
      mobileQuery.removeEventListener('change', onMobileChange);
      reducedMotion.removeEventListener('change', onMobileChange);
      track?.removeEventListener('touchstart', pauseAuto);
      track?.removeEventListener('touchend', onTouchEnd);
      track?.removeEventListener('pointerdown', pauseAuto);
    };
  }, [textReviewCards.length, getCardsStep, scrollToCardIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || carouselItems.length <= 1) return;

    const syncDotFromScroll = () => {
      const step = getCarouselStep();
      if (step <= 0) return;
      const index = Math.round(track.scrollLeft / step);
      setActiveDot(Math.min(carouselItems.length - 1, Math.max(0, index)));
    };

    track.addEventListener('scroll', syncDotFromScroll, { passive: true });
    return () => track.removeEventListener('scroll', syncDotFromScroll);
  }, [carouselItems.length, getCarouselStep]);

  useEffect(() => {
    if (carouselItems.length <= 1) return;
    if (typeof window === 'undefined') return;

    const mobileQuery = window.matchMedia('(max-width: 992px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let intervalId: ReturnType<typeof setInterval> | undefined;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const pauseAuto = () => {
      videoAutoPausedRef.current = true;
      if (resumeTimer) clearTimeout(resumeTimer);
    };

    const resumeAuto = (delayMs = 3500) => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        videoAutoPausedRef.current = false;
      }, delayMs);
    };

    const advance = () => {
      if (videoAutoPausedRef.current || !mobileQuery.matches || reducedMotion.matches) return;

      const track = trackRef.current;
      if (!track) return;

      const step = getCarouselStep();
      const maxScroll = track.scrollWidth - track.clientWidth;
      const atEnd = track.scrollLeft >= maxScroll - 8;

      if (atEnd) {
        scrollToCarouselIndex(0);
      } else {
        const nextIndex = Math.min(
          carouselItems.length - 1,
          Math.round(track.scrollLeft / step) + 1,
        );
        scrollToCarouselIndex(nextIndex);
      }
    };

    const startAuto = () => {
      if (!mobileQuery.matches || reducedMotion.matches) return;
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(advance, 4000);
    };

    const stopAuto = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = undefined;
    };

    const onMobileChange = () => {
      videoAutoPausedRef.current = false;
      stopAuto();
      startAuto();
    };

    startAuto();
    mobileQuery.addEventListener('change', onMobileChange);
    reducedMotion.addEventListener('change', onMobileChange);

    const track = trackRef.current;
    const onTouchEnd = () => resumeAuto();

    track?.addEventListener('touchstart', pauseAuto, { passive: true });
    track?.addEventListener('touchend', onTouchEnd, { passive: true });
    track?.addEventListener('pointerdown', pauseAuto);

    return () => {
      stopAuto();
      if (resumeTimer) clearTimeout(resumeTimer);
      if (resumeVideoAutoTimerRef.current) clearTimeout(resumeVideoAutoTimerRef.current);
      mobileQuery.removeEventListener('change', onMobileChange);
      reducedMotion.removeEventListener('change', onMobileChange);
      track?.removeEventListener('touchstart', pauseAuto);
      track?.removeEventListener('touchend', onTouchEnd);
      track?.removeEventListener('pointerdown', pauseAuto);
    };
  }, [carouselItems.length, getCarouselStep, scrollToCarouselIndex]);

  const toggleExpand = (index: number) => {
    pauseCardsAutoBriefly();
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
        <div className="reviews-v3-cards-section reviews-v3-cards-section--mobile-auto">
        <div className="reviews-v3-cards" ref={cardsTrackRef}>
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

        {textReviewCards.length > 1 && (
          <div className="reviews-v3-dots reviews-v3-dots--cards" role="tablist" aria-label="Review cards">
            {textReviewCards.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeCardDot === i}
                className={`reviews-v3-dot${activeCardDot === i ? ' is-active' : ''}`}
                onClick={() => {
                  pauseCardsAutoBriefly();
                  scrollToCardIndex(i);
                }}
              />
            ))}
          </div>
        )}
        </div>

        {carouselItems.length > 1 && (
          <div className="reviews-v3-carousel-section reviews-v3-carousel-section--mobile-auto">
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
                    pauseVideoAutoBriefly();
                    scrollToCarouselIndex(i);
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
