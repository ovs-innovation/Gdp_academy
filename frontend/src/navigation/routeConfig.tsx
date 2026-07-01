import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppPreloader from '../components/common/AppPreloader';

const pageLoaders = {
  Home: () => import('../pages/Home'),
  About: () => import('../pages/About'),
  Programs: () => import('../pages/Programs'),
  Schedule: () => import('../pages/Schedule'),
  Membership: () => import('../pages/Membership'),
  Contact: () => import('../pages/Contact'),
  Login: () => import('../pages/Login'),
  Signup: () => import('../pages/Signup'),
  Dashboard: () => import('../pages/Dashboard'),
  Blog: () => import('../pages/Blog'),
  Workshops: () => import('../pages/Workshops'),
  Gallery: () => import('../pages/Gallery'),
  FAQ: () => import('../pages/FAQ'),
  Terms: () => import('../pages/Terms'),
  Privacy: () => import('../pages/Privacy'),
  Services: () => import('../pages/Services'),
  LiveZoomSessions: () => import('../pages/LiveZoomSessions'),
  ForgotPassword: () => import('../pages/ForgotPassword'),
} as const;

export const prefetchAllRoutes = (): void => {
  Object.values(pageLoaders).forEach((load) => {
    load().catch(() => {});
  });
};

const Home = React.lazy(pageLoaders.Home);
const About = React.lazy(pageLoaders.About);
const Programs = React.lazy(pageLoaders.Programs);
const Schedule = React.lazy(pageLoaders.Schedule);
const Membership = React.lazy(pageLoaders.Membership);
const Contact = React.lazy(pageLoaders.Contact);
const Login = React.lazy(pageLoaders.Login);
const Signup = React.lazy(pageLoaders.Signup);
const Dashboard = React.lazy(pageLoaders.Dashboard);
const Blog = React.lazy(pageLoaders.Blog);
const Workshops = React.lazy(pageLoaders.Workshops);
const Gallery = React.lazy(pageLoaders.Gallery);
const FAQ = React.lazy(pageLoaders.FAQ);
const Terms = React.lazy(pageLoaders.Terms);
const Privacy = React.lazy(pageLoaders.Privacy);
const Services = React.lazy(pageLoaders.Services);
const LiveZoomSessions = React.lazy(pageLoaders.LiveZoomSessions);
const ForgotPassword = React.lazy(pageLoaders.ForgotPassword);

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return <AppPreloader variant="session" />;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <AppPreloader variant="session" />;
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
  { path: '/services/*', element: <Navigate to="/services" replace /> },
  { path: '/wellness', element: <Navigate to="/services" replace /> },
  { path: '/wellness/*', element: <Navigate to="/services" replace /> },
  { path: '/testimonials', element: <Navigate to="/#reviews" replace /> },
  { path: '/live-zoom', element: <LiveZoomSessions /> },
];

export default routeConfig;
