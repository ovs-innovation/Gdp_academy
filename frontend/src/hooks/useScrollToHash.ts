import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HEADER_OFFSET = 100;

export function useScrollToHash(offset = HEADER_OFFSET) {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.replace('#', '');
    let attempts = 0;
    let timer: number | undefined;

    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        return;
      }
      if (attempts < 24) {
        attempts += 1;
        timer = window.setTimeout(scrollToTarget, 150);
      }
    };

    timer = window.setTimeout(scrollToTarget, 120);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [location.hash, location.pathname, offset]);
}
