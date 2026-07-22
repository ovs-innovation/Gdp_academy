import React, { useEffect, useRef, useState } from 'react';
import '../../styles/lazy-load.css';

type LazySectionProps = {
  children: React.ReactNode;
  className?: string;
  minHeight?: number | string;
  rootMargin?: string;
  onVisible?: () => void;
  placeholder?: React.ReactNode;
};

const LazySection: React.FC<LazySectionProps> = ({
  children,
  className = '',
  minHeight = 200,
  rootMargin = '320px',
  onVisible,
  placeholder,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const onVisibleRef = useRef(onVisible);
  const [visible, setVisible] = useState(false);

  onVisibleRef.current = onVisible;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      onVisibleRef.current?.();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          onVisibleRef.current?.();
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={`lazy-section${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={!visible ? { minHeight } : undefined}
    >
      {visible ? children : placeholder}
    </div>
  );
};

export default LazySection;
