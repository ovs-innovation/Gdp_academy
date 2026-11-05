import React, { useEffect, useState } from 'react';
import MediaPlayButton from './MediaPlayButton';

type Props = {
  ytId: string;
  title: string;
  views?: string;
  isPlaying: boolean;
  onPlay: () => void;
};

const posterFill: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

function buildEmbedUrl(ytId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
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

function posterUrl(ytId: string, kind: 'webp' | 'jpg'): string {
  if (kind === 'webp') return `https://i.ytimg.com/vi_webp/${ytId}/oar2.webp`;
  return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
}

const YTShortCard: React.FC<Props> = ({ ytId, title, views, isPlaying, onPlay }) => {
  const [thumbKind, setThumbKind] = useState<'webp' | 'jpg'>('webp');
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    setFrameReady(false);
    setThumbKind('webp');
  }, [ytId]);

  useEffect(() => {
    if (!isPlaying) setFrameReady(false);
  }, [isPlaying]);

  const play = () => onPlay();

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isPlaying) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    play();
  };

  return (
    <div
      className="yt-short-card"
      role={isPlaying ? undefined : 'button'}
      tabIndex={isPlaying ? undefined : 0}
      aria-label={isPlaying ? undefined : `Play ${title || 'YouTube short'}`}
      onClick={isPlaying ? undefined : play}
      onKeyDown={onKeyDown}
    >
      <div className="yt-short-iframe-wrapper" style={{ width: '100%', height: '100%', position: 'relative' }}>
        {(!isPlaying || !frameReady) && (
          <img
            src={posterUrl(ytId, thumbKind)}
            alt=""
            className="yt-short-iframe"
            loading="lazy"
            decoding="async"
            draggable={false}
            style={posterFill}
            onError={() => {
              if (thumbKind !== 'jpg') setThumbKind('jpg');
            }}
          />
        )}
        {isPlaying && (
          <iframe
            src={buildEmbedUrl(ytId)}
            className="yt-short-iframe"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={title}
            onLoad={() => setFrameReady(true)}
          />
        )}
        {!isPlaying && (
          <>
            <div className="yt-short-overlay gdp-video-card-overlay" aria-hidden="true" />
            <MediaPlayButton size="md" />
          </>
        )}
      </div>

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
