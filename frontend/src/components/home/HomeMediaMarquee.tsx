import React, { useRef } from 'react';

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  rowClassName?: string;
  /** Accessible label for the scroll region */
  ariaLabel?: string;
  layout?: 'media' | 'services';
};

const LAYOUT = {
  media: {
    carousel: 'home-media-carousel',
    track: 'home-media-marquee',
    row: 'home-media-marquee-row',
  },
  services: {
    carousel: 'services-v2-carousel',
    track: 'services-v2-track',
    row: 'services-v2-grid',
  },
} as const;

/** Horizontal strip — manual swipe/scroll, no arrow controls. */
function HomeMediaMarquee<T>({
  items,
  renderItem,
  rowClassName = '',
  ariaLabel = 'Media gallery',
  layout = 'media',
}: Props<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const config = LAYOUT[layout];

  return (
    <div className={config.carousel} role="region" aria-label={ariaLabel}>
      <div className={config.track} ref={trackRef}>
        <div className={`${config.row} ${rowClassName}`.trim()}>
          {items.map((item, index) => (
            <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeMediaMarquee;
