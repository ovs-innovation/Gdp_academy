import React from 'react';

type Props = {
  size?: 'md' | 'lg';
  className?: string;
};

/** Centered blue play button for homepage media cards. */
const MediaPlayButton: React.FC<Props> = ({ size = 'lg', className = '' }) => (
  <div
    className={`gdp-media-play-btn gdp-media-play-btn--${size} ${className}`.trim()}
    aria-hidden="true"
  >
    <span className="gdp-media-play-btn__ring" />
    <span className="gdp-media-play-btn__icon">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
      </svg>
    </span>
  </div>
);

export default MediaPlayButton;
