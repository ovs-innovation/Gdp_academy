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
