import React, { useState, useEffect, useRef } from 'react';
import { extractYoutubeVideoId, normalizeVideoSource } from '../../utils/mediaUrl';

interface LazyVideoProps {
  src: string;
  className?: string;
  scale?: number;
}

const LazyVideo: React.FC<LazyVideoProps> = ({ src, className, scale = 1.1 }) => {
  const elRef = useRef<HTMLDivElement | HTMLVideoElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const normalizedSrc = normalizeVideoSource(src);
  const youtubeId = extractYoutubeVideoId(normalizedSrc);
  const isYouTube = Boolean(youtubeId);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: '400px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isYouTube) return;
    const video = elRef.current as HTMLVideoElement | null;
    if (!video) return;

    if (isVisible) {
      video.load();
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible, isYouTube, normalizedSrc]);

  if (!normalizedSrc) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          background: '#111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontSize: 12,
        }}
      >
        No video URL
      </div>
    );
  }

  if (isYouTube && youtubeId) {
    return (
      <div
        ref={elRef as React.RefObject<HTMLDivElement>}
        className={className}
        style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
      >
        {isVisible && (
          <iframe
            title="YouTube video"
            width="100%"
            height="100%"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${youtubeId}&playsinline=1&modestbranding=1&rel=0`}
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: `translate(-50%, -50%) scale(${scale})`,
              minWidth: '100%',
              minHeight: '100%',
              border: 0,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <video
      ref={elRef as React.RefObject<HTMLVideoElement>}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    >
      {isVisible && <source src={normalizedSrc} type="video/mp4" />}
    </video>
  );
};

export default LazyVideo;
