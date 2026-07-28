import React from 'react';

type Props = {
  ytId: string;
  title: string;
  views?: string;
  isPlaying: boolean;
  onPlay: () => void;
};

function buildEmbedUrl(ytId: string, shouldPlay: boolean): string {
  const params = new URLSearchParams({
    autoplay: shouldPlay ? '1' : '0',
    mute: '0',
    loop: '1',
    playlist: ytId,
    controls: '1',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
    enablejsapi: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`;
}

const YTShortCard: React.FC<Props> = ({ ytId, title, views, isPlaying, onPlay }) => {
  return (
    <div className="yt-short-card" onClick={onPlay}>
      <div className="yt-short-iframe-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <iframe
          key={`${ytId}-${isPlaying}`}
          src={buildEmbedUrl(ytId, isPlaying)}
          className="yt-short-iframe"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
        />
        {/* Overlay is only present when not playing to intercept the first click and trigger onPlay */}
        {!isPlaying && (
          <div 
            className="yt-short-overlay" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: 100 + '%', 
              height: 100 + '%', 
              cursor: 'pointer',
              background: 'rgba(0,0,0,0.1)'
            }} 
          />
        )}
      </div>

      {/* YouTube info */}
      <div className="yt-shorts-ui">
        <div className="yt-shorts-bottom-info">
          <p className="yt-short-title">{title}</p>
          {views && <span className="yt-short-views">{views} views</span>}
        </div>
      </div>
    </div>
  );
};

export default YTShortCard;
