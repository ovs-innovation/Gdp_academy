import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { routeConfig } from './routeConfig';

const AppNavigation: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div
          className="preloader"
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#060606',
            color: '#634BFA',
            fontFamily: 'Krona One',
            letterSpacing: '4px',
          }}
        >
          GDP ACADEMY
        </div>
      }
    >
      <Routes>
        {routeConfig.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default AppNavigation;
