import React, { useState, useEffect, useRef } from 'react';

interface LazyVideoProps {
  src: string;
  className?: string;
  scale?: number;
}

const LazyVideo: React.FC<LazyVideoProps> = ({ src, className, scale = 1.1 }) => {
  const elRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

  if (isYouTube) {
    const videoId = src.includes('youtube.com') ? src.split('embed/')[1]?.split('?')[0] : src.split('youtu.be/')[1];
    return (
      <div ref={elRef} className={className} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
        {isVisible && (
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&vq=hd1080&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0`} 
            frameBorder="0" 
            allow="autoplay; encrypted-media" 
            allowFullScreen
            style={{ 
              objectFit: 'cover', 
              pointerEvents: 'none', 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              width: '100%', 
              height: '100%', 
              transform: `translate(-50%, -50%) scale(${scale})`,
              minWidth: '100%',
              minHeight: '100%'
            }}
          ></iframe>
        )}
      </div>
    );
  }

  return (
    <video
      ref={elRef}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    >
      {isVisible && <source src={src} type="video/mp4" />}
    </video>
  );
};

export default LazyVideo;
