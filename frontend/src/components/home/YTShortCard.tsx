import React from 'react';

type Props = {
  ytId: string;
  title: string;
  views?: string;
};

function buildEmbedUrl(ytId: string): string {
  const params = new URLSearchParams({
    autoplay: '0',
    mute: '0',
    loop: '1',
    playlist: ytId,
    controls: '1',
    modestbranding: '1',
    rel: '0',
    playsinline: '1',
  });
  return `https://www.youtube-nocookie.com/embed/${ytId}?${params.toString()}`;
}

const YTShortCard: React.FC<Props> = ({ ytId, title, views }) => {
  return (
    <div className="yt-short-card">
      <div className="yt-short-iframe-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <iframe
          src={buildEmbedUrl(ytId)}
          className="yt-short-iframe"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={title}
        />
        <div className="yt-short-overlay" style={{ pointerEvents: 'none' }} />
      </div>


      {/* YouTube badge + info */}
      <div className="yt-shorts-ui">
        <div className="yt-shorts-top-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span>Shorts</span>
        </div>
        <div className="yt-shorts-bottom-info">
          <p className="yt-short-title">{title}</p>
          {views && <span className="yt-short-views">{views} views</span>}
        </div>
      </div>
    </div>
  );
};

export default YTShortCard;
