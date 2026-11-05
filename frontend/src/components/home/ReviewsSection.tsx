import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import LazyImage from '../common/LazyImage';
import { extractYoutubeVideoId, normalizeVideoSource } from '../../utils/mediaUrl';

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
  titlePrefix?: string;
  titleHighlight?: string;
  badgeText?: string;
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

function youtubePoster(ytId: string, kind: 'max' | 'hq'): string {
  if (kind === 'max') return `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
  return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
}

function ClientVideoCard({
  vid,
  img,
  quote,
  isPlaying,
  onPlay,
}: {
  vid: string;
  img?: string;
  quote?: string;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const normalized = normalizeVideoSource(vid);
  const ytId = extractYoutubeVideoId(normalized);
  const [thumbKind, setThumbKind] = useState<'max' | 'hq' | 'image'>(ytId ? 'max' : 'image');

  useEffect(() => {
    setThumbKind(ytId ? 'max' : 'image');
  }, [ytId, vid]);

  const stepDownPoster = () => {
    if (!ytId) return;
    setThumbKind((current) => {
      if (current === 'max') return 'hq';
      if (current === 'hq' && img) return 'image';
      return current;
    });
  };

  const poster = ytId
    ? thumbKind === 'image' && img
      ? img
      : youtubePoster(ytId, thumbKind === 'hq' ? 'hq' : 'max')
    : img;

  return (
    <div className="reviews-v3-carousel-item reviews-v3-video-card">
      {isPlaying && ytId ? (
        <iframe
          className="reviews-v3-video-media"
          src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title="Client story"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : isPlaying && normalized ? (
        <video className="reviews-v3-video-media" src={normalized} controls autoPlay playsInline />
      ) : (
        <div
          className="reviews-v3-video-hit"
          role="button"
          tabIndex={0}
          aria-label="Play client story"
          onClick={onPlay}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            onPlay();
          }}
        >
          {poster ? (
            <img
              src={poster}
              alt=""
              className="reviews-v3-video-media"
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={(event) => {
                if (event.currentTarget.naturalWidth > 0 && event.currentTarget.naturalWidth < 200) {
                  stepDownPoster();
                }
              }}
              onError={stepDownPoster}
            />
          ) : null}
          <span className="reviews-v3-video-shade" />
          <span className="reviews-v3-play-btn reviews-v3-play-btn--sm" aria-hidden="true">
            <span>▶</span>
          </span>
          {quote ? (
            <span className="reviews-v3-video-quote">
              <span>&ldquo;</span>
              <p>{truncate(quote, 72)}</p>
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  titlePrefix = 'From Our',
  titleHighlight = 'Clients',
  badgeText = 'Our Community',
  subtitle = 'Real stories from students, couples & performers who learned, celebrated & grew with GDP.',
  googleRating = '5.0',
  googleReviewCount = '(236)',
  reviews,
  videoTestimonials = [],
}) => {
  const reviewCountLabel = googleReviewCount.replace(/[()]/g, '').trim();
  const cardsTrackRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [activeCardDot, setActiveCardDot] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [playingId, setPlayingId] = useState<string | number | null>(null);

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

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <section className="reviews-v3 section-padding" id="reviews">
      <div className="container">
        <header className="reviews-v3-header">
          <span className="reviews-v3-badge">
            <span className="reviews-v3-badge-icon" aria-hidden="true">♥</span>
            {badgeText}
          </span>
          <h2 className="reviews-v3-title">
            {titlePrefix} <span className="gradient-text">{titleHighlight}</span>
          </h2>
          <p className="reviews-v3-subtitle">{subtitle}</p>
          <div className="reviews-v3-divider" aria-hidden="true">
            <span />
            <span className="reviews-v3-divider-heart">♥</span>
            <span />
          </div>
        </header>

        <div className="reviews-v3-body">
        <div className="reviews-v3-cards-section">
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
                  <LazyImage src={review.image} alt={review.name} rootMargin="250px" />
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
                onClick={() => scrollToCardIndex(i)}
              />
            ))}
          </div>
        )}
        </div>

        {carouselItems.length > 1 && (
          <div className="reviews-v3-carousel-section">
            <div className="reviews-v3-carousel-viewport">
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
                    <ClientVideoCard
                      key={item.id}
                      vid={item.vid}
                      img={item.img}
                      quote={item.quote}
                      isPlaying={playingId === item.id}
                      onPlay={() => setPlayingId(item.id)}
                    />
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
                  onClick={() => scrollToCarouselIndex(i)}
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
