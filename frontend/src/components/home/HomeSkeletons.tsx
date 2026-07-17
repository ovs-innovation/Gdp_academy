import React from 'react';

type MediaSkeletonProps = {
  count?: number;
  ariaLabel?: string;
};

/** CSS-only media strip skeleton (YouTube shorts / Instagram reels). */
export const HomeMediaSkeleton: React.FC<MediaSkeletonProps> = ({
  count = 4,
  ariaLabel = 'Loading media',
}) => (
  <div className="home-media-carousel" role="status" aria-busy="true" aria-label={ariaLabel}>
    <div className="home-media-marquee">
      <div className="home-media-marquee-row">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="home-skel home-skel-media-card" />
        ))}
      </div>
    </div>
  </div>
);

export const HomeServicesSkeleton: React.FC = () => (
  <div className="services-v2-carousel" role="status" aria-busy="true" aria-label="Loading services">
    <div className="services-v2-grid">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="home-skel home-skel-service" />
      ))}
    </div>
  </div>
);

export const HomeFaqSkeleton: React.FC = () => (
  <div className="faq-v3-list" role="status" aria-busy="true" aria-label="Loading FAQs">
    {Array.from({ length: 4 }, (_, i) => (
      <div key={i} className="home-skel home-skel-faq-item" />
    ))}
  </div>
);

export const HomeReviewsSkeleton: React.FC = () => (
  <div className="home-skel-reviews-grid" role="status" aria-busy="true" aria-label="Loading reviews">
    {Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="home-skel home-skel-review-card" />
    ))}
  </div>
);

export default HomeMediaSkeleton;
