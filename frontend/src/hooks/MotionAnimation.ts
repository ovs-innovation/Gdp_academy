import { useEffect } from 'react';
import { TweenMax } from 'gsap';

const MotionAnimation = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarsePointer) return;

    let rafId = 0;
    let lastEvent: MouseEvent | null = null;

    const applyParallax = () => {
      rafId = 0;
      const e = lastEvent;
      if (!e) return;

      const wraps = document.querySelectorAll('.tg-motion-effects');
      wraps.forEach((wrap) => {
        const parallaxIt = (targetClass: string, movement: number) => {
          const target = wrap.querySelector(targetClass) as HTMLElement;
          if (!target) return;

          const rect = wrap.getBoundingClientRect();
          const relX = e.clientX - rect.left;
          const relY = e.clientY - rect.top;

          TweenMax.to(target, 0.8, {
            x: ((relX - rect.width / 2) / rect.width) * movement,
            y: ((relY - rect.height / 2) / rect.height) * movement,
          });
        };

        parallaxIt('.tg-motion-effects1', 20);
        parallaxIt('.tg-motion-effects2', 5);
        parallaxIt('.tg-motion-effects3', -10);
        parallaxIt('.tg-motion-effects4', 30);
        parallaxIt('.tg-motion-effects5', -50);
        parallaxIt('.tg-motion-effects6', -20);
        parallaxIt('.tg-motion-effects7', 40);
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastEvent = e;
      if (!rafId) {
        rafId = window.requestAnimationFrame(applyParallax);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);
};

export default MotionAnimation;
