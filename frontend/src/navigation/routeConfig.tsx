import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Lazy loaded page components
const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Programs = React.lazy(() => import('../pages/Programs'));
const Schedule = React.lazy(() => import('../pages/Schedule'));
const Membership = React.lazy(() => import('../pages/Membership'));
const Contact = React.lazy(() => import('../pages/Contact'));
const Login = React.lazy(() => import('../pages/Login'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Blog = React.lazy(() => import('../pages/Blog'));
const Workshops = React.lazy(() => import('../pages/Workshops'));
const Gallery = React.lazy(() => import('../pages/Gallery'));
const FAQ = React.lazy(() => import('../pages/FAQ'));
const Terms = React.lazy(() => import('../pages/Terms'));
const Privacy = React.lazy(() => import('../pages/Privacy'));
const Services = React.lazy(() => import('../pages/Services'));
const ServiceDetails = React.lazy(() => import('../pages/ServiceDetails'));
const Testimonials = React.lazy(() => import('../pages/Testimonials'));
const LiveZoomSessions = React.lazy(() => import('../pages/LiveZoomSessions'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));

// Route guards
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
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
        VERIFYING SESSION...
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" /> : <>{children}</>;
};

interface RouteItem {
  path: string;
  element: JSX.Element;
}

export const routeConfig: RouteItem[] = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/programs', element: <Programs /> },
  { path: '/schedule', element: <Schedule /> },
  { path: '/membership', element: <Membership /> },
  { path: '/contact', element: <Contact /> },
  { path: '/login', element: <AuthRoute><Login /></AuthRoute> },
  { path: '/signup', element: <AuthRoute><Signup /></AuthRoute> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: '/my-dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: '/my-wishlist', element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: '/my-profile-setting', element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: '/my-history', element: <PrivateRoute><Dashboard /></PrivateRoute> },
  { path: '/blog', element: <Blog /> },
  { path: '/workshops', element: <Workshops /> },
  { path: '/gallery', element: <Gallery /> },
  { path: '/faq', element: <FAQ /> },
  { path: '/terms', element: <Terms /> },
  { path: '/privacy', element: <Privacy /> },
  { path: '/services', element: <Services /> },
  { path: '/services/:id', element: <ServiceDetails /> },
  { path: '/testimonials', element: <Testimonials /> },
  { path: '/live-zoom', element: <LiveZoomSessions /> },
];

export default routeConfig;
