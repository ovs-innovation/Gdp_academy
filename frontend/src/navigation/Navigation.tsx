import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppPreloader from '../components/common/AppPreloader';
import { routeConfig, prefetchAllRoutes } from './routeConfig';

// Module-level flag: the full-screen branded preloader should only appear on
// the very first app load. Once the app has rendered a route once, any later
// Suspense (rare, only if a chunk isn't prefetched yet) shows a slim top bar
// instead of the big preloader that looked like a "second navbar".
let appHasRenderedOnce = false;

const HydrationMarker: React.FC = () => {
  useEffect(() => {
    appHasRenderedOnce = true;
  }, []);
  return null;
};

const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const RouteFallback: React.FC = () =>
  appHasRenderedOnce ? (
    <div className="route-progress" role="status" aria-live="polite" aria-busy="true">
      <span className="route-progress__bar" />
    </div>
  ) : (
    <AppPreloader variant="default" />
  );

const AppNavigation: React.FC = () => {
  useEffect(() => {
    // Prefetch every page chunk shortly after the first paint so that clicking
    // navbar links navigates instantly without a Suspense flash or page glitch.
    const run = () => prefetchAllRoutes();
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(run);
      return () => w.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(run, 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<RouteFallback />}>
      <HydrationMarker />
      <ScrollToTopOnNavigate />
      <Routes>
        {routeConfig.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppNavigation;
