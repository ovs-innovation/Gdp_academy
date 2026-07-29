import React from 'react';
import MediaPlayButton from './MediaPlayButton';

type Props = {
  reelId: string;
  isPlaying: boolean;
  onPlay: () => void;
};

const InstaReelCard: React.FC<Props> = ({ reelId, isPlaying, onPlay }) => {
  return (
    <div className="yt-short-card" onClick={onPlay}>
      <div className="yt-short-iframe-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <iframe
          key={`${reelId}-${isPlaying}`}
          // If not active playing, render a static preview embed, else render autoplay/active configuration
          src={`https://www.instagram.com/p/${reelId}/embed/${isPlaying ? '' : '?utm_source=ig_embed'}`}
          className="yt-short-iframe"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          allow="encrypted-media; autoplay"
          title={`Instagram reel ${reelId}`}
        />
        {!isPlaying && (
          <>
            <div className="yt-short-overlay gdp-video-card-overlay" aria-hidden="true" />
            <MediaPlayButton size="md" />
          </>
        )}
      </div>
    </div>
  );
};

export default InstaReelCard;
