import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import '../styles/auth.css';

const Signup: React.FC = () => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({ name, email, password, role: 'student' });
      toast.success('Registration successful! Welcome to the Studio.');
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed');
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
                JOIN <span className="gradient-text">GDP STUDIO</span>
              </h2>
              <p>Create your membership and start your dance mastery journey today.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>FULL NAME</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <p
                className="terms-text"
                style={{
                  fontSize: '11px',
                  color: 'var(--text-gray)',
                  marginBottom: '32px',
                  letterSpacing: '1px',
                }}
              >
                By signing up, you agree to our <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>.
              </p>
              <button type="submit" className="primary-btn join-btn w-full" disabled={isLoading}>
                {isLoading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already a member?{' '}
                <Link to="/login" className="gradient-text">
                  LOGIN TO YOUR PORTAL
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Signup;
