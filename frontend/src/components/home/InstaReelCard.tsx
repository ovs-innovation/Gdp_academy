import React from 'react';

type Props = {
  reelId: string;
  url: string;
};

const InstaReelCard: React.FC<Props> = ({ reelId }) => {
  return (
    <div className="yt-short-card">
      <div className="yt-short-iframe-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <iframe
          src={`https://www.instagram.com/p/${reelId}/embed/`}
          className="yt-short-iframe"
          frameBorder="0"
          scrolling="no"
          allowTransparency={true}
          allow="encrypted-media; autoplay"
          title={`Instagram reel ${reelId}`}
        />
        <div className="yt-short-overlay" style={{ pointerEvents: 'none' }} />
      </div>



    </div>
  );
};

export default InstaReelCard;
