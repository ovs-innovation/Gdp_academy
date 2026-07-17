import React, { useRef } from 'react';

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  rowClassName?: string;
  /** Accessible label for the scroll region */
  ariaLabel?: string;
};

/** Horizontal media strip with ‹ › arrow controls (no free swipe UX). */
function HomeMediaMarquee<T>({
  items,
  renderItem,
  rowClassName = '',
  ariaLabel = 'Media gallery',
}: Props<T>) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.home-media-marquee-row > *');
    const gap = 24;
    const step = card ? card.offsetWidth + gap : 304;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <div className="home-media-carousel" role="region" aria-label={ariaLabel}>
      <button
        type="button"
        className="home-media-arrow home-media-arrow--prev"
        onClick={() => scrollByCard(-1)}
        aria-label="Previous"
      >
        ‹
      </button>

      <div className="home-media-marquee" ref={trackRef}>
        <div className={`home-media-marquee-row ${rowClassName}`.trim()}>
          {items.map((item, index) => (
            <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="home-media-arrow home-media-arrow--next"
        onClick={() => scrollByCard(1)}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}

export default HomeMediaMarquee;
