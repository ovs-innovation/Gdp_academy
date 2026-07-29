import React, { useEffect, useRef } from 'react';
import MediaPlayButton from './MediaPlayButton';

type Props = {
  src: string;
  isPlaying: boolean;
  onPlay: () => void;
  title?: string;
  likes?: string;
  comments?: string;
  views?: string;
};

/** Native MP4 / Cloudinary video card (used when admin uploads a file instead of embed link). */
const DirectVideoCard: React.FC<Props> = ({
  src,
  isPlaying,
  onPlay,
  title,
  likes,
  comments,
  views,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isPlaying, src]);

  return (
    <div className="yt-short-card" onClick={onPlay}>
      <div
        className="yt-short-iframe-wrapper"
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        <video
          ref={videoRef}
          src={src}
          className="yt-short-iframe"
          muted={!isPlaying}
          loop
          playsInline
          controls={isPlaying}
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {!isPlaying && (
          <>
            <div className="yt-short-overlay gdp-video-card-overlay" aria-hidden="true" />
            <MediaPlayButton size="md" />
          </>
        )}
      </div>

      {(title || likes || comments || views) && (
        <div className="yt-shorts-ui">
          <div className="yt-shorts-bottom-info">
            {title && <p className="yt-short-title">{title}</p>}
            {views && <span className="yt-short-views">{views} views</span>}
            {(likes || comments) && (
              <span className="yt-short-views">
                {[likes && `${likes} likes`, comments && `${comments} comments`]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectVideoCard;
