import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
    } catch (error: any) {
      if (error?.message === 'OTP_REQUIRED') {
        toast.info('OTP required for login.');
      } else {
        toast.error(error?.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="auth-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="auth-card glass-card"
          >
            <div className="auth-header">
              <h2>
                WELCOME <span className="gradient-text">BACK</span>
              </h2>
              <p>Login to your GDP portal to continue your practice.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>PASSWORD</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <label className="remember-me">
                  <input type="checkbox" /> REMEMBER ME
                </label>
                <Link to="/forgot-password">FORGOT PASSWORD?</Link>
              </div>
              <button type="submit" className="primary-btn join-btn w-full" disabled={isLoading}>
                {isLoading ? 'VERIFYING...' : 'LOGIN TO DASHBOARD'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                New to the platform?{' '}
                <Link to="/signup" className="gradient-text">
                  JOIN GDP STUDIO
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
