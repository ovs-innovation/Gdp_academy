import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API Call here
    setIsSubmitted(true);
  };

  return (
    <Layout>
      <section className="auth-section section-padding" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="glass-card auth-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '60px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="section-title" style={{ fontSize: '28px', marginBottom: '16px' }}>RESET <span className="gradient-text">PASSWORD</span></h2>
              
              {!isSubmitted ? (
                <>
                  <p style={{ color: 'var(--text-gray)', marginBottom: '30px', fontSize: '14px' }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '24px', textAlign: 'left' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>EMAIL ADDRESS</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', color: '#fff', borderRadius: '4px' }}
                        placeholder="your@email.com"
                      />
                    </div>
                    <button type="submit" className="primary-btn join-btn" style={{ width: '100%', background: 'var(--primary-color)' }}>SEND RESET LINK</button>
                  </form>
                </>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '50px', marginBottom: '20px' }}>✉️</div>
                  <p style={{ color: 'var(--text-gray)', marginBottom: '30px', fontSize: '15px' }}>
                    If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                  </p>
                  <Link to="/login" className="text-btn">BACK TO LOGIN</Link>
                </div>
              )}

              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <Link to="/login" style={{ fontSize: '12px', color: 'var(--text-gray)', textDecoration: 'none' }}>REMEMBERED? <span style={{ color: 'var(--accent-color)', fontWeight: '700' }}>LOGIN</span></Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
