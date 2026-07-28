import React from 'react';

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
          <div 
            className="yt-short-overlay" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.1)'
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default InstaReelCard;
