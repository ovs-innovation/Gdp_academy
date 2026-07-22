import React, { useEffect, useRef, useState } from 'react';
import '../../styles/lazy-load.css';

type LazyImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> & {
  src: string;
  rootMargin?: string;
};

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  className = '',
  rootMargin = '200px',
  onError,
  ...rest
}) => {
  const ref = useRef<HTMLImageElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setLoadedSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadedSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, rootMargin]);

  return (
    <img
      ref={ref}
      src={loadedSrc ?? undefined}
      alt={alt}
      className={`lazy-image${loadedSrc ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`}
      decoding="async"
      onError={onError}
      {...rest}
    />
  );
};

export default LazyImage;
