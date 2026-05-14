import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Lazy load pages
const Home = React.lazy(() => import('../pages/Home'));
const About = React.lazy(() => import('../pages/About'));
const Programs = React.lazy(() => import('../pages/Programs'));
const Schedule = React.lazy(() => import('../pages/Schedule'));
const VideoLibrary = React.lazy(() => import('../pages/VideoLibrary'));
const Instructors = React.lazy(() => import('../pages/Instructors'));
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
const Testimonials = React.lazy(() => import('../pages/Testimonials'));
const LiveZoomSessions = React.lazy(() => import('../pages/LiveZoomSessions'));
const ForgotPassword = React.lazy(() => import('../pages/ForgotPassword'));

// Helper for Private Routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="preloader" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060606', color: '#634BFA', fontFamily: 'Krona One', letterSpacing: '4px' }}>VERIFYING SESSION...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Helper for Auth Routes (Login/Signup should not be accessible if logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

const AppNavigation = () => {
  return (
    <Suspense fallback={<div className="preloader" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060606', color: '#634BFA', fontFamily: 'Krona One', letterSpacing: '4px' }}>GDP ACADEMY</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/library" element={<VideoLibrary />} />
        <Route path="/coaches" element={<Instructors />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth Restricted Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-profile-setting" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-wishlist" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/my-history" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/live-zoom" element={<LiveZoomSessions />} />

        {/* Compatibility with old routes if needed */}
        <Route path="/courses" element={<Programs />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/registration" element={<Signup />} />
        <Route path="/instructors" element={<Instructors />} />
        
        <Route path="*" element={<div style={{ padding: '100px', textAlign: 'center' }}><h1>404 - Page Not Found</h1><a href="/">Go Home</a></div>} />
      </Routes>
    </Suspense>
  );
};

export default AppNavigation;
