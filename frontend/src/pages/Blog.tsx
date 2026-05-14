import React from 'react';
import Layout from '../components/layout/Layout';
import { motion } from 'framer-motion';

const Blog: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: "The Art of Contemporary Flow",
      date: "Oct 24, 2024",
      category: "Technique",
      author: "Marcus Chen",
      excerpt: "Exploring the fluid movements and emotional depth of modern contemporary dance styles.",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "Mastering the Stage: Performance Tips",
      date: "Oct 20, 2024",
      category: "Performance",
      author: "Elena Volkova",
      excerpt: "How to overcome stage fright and project confidence during professional showcases.",
      image: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Urban Rhythms: Hip-Hop Culture",
      date: "Oct 15, 2024",
      category: "Culture",
      author: "Jordan Knight",
      excerpt: "Tracing the history and evolution of urban dance styles from the streets to the stage.",
      image: "https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <Layout>
      <section className="blog-hero section-padding">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            LATEST <span className="gradient-text">INSIGHTS</span>
          </motion.h1>
          <p className="hero-subtitle">Deep dives into dance technique, culture, and professional artistry.</p>
        </div>
      </section>

      <section className="blog-content section-padding" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {posts.map((post, i) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="blog-card glass-card"
                style={{ padding: '0', overflow: 'hidden' }}
              >
                <div className="blog-image" style={{ height: '240px', overflow: 'hidden' }}>
                  <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="blog-info" style={{ padding: '30px' }}>
                  <div className="blog-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                    <span style={{ color: 'var(--accent-color)', fontSize: '10px', letterSpacing: '2px', fontWeight: '700' }}>{post.category.toUpperCase()}</span>
                    <span style={{ color: 'var(--text-gray)', fontSize: '12px' }}>{post.date}</span>
                  </div>
                  <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#fff', fontFamily: 'Montserrat', fontWeight: '700' }}>{post.title}</h3>
                  <p style={{ color: 'var(--text-gray)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>{post.excerpt}</p>
                  <div className="blog-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#fff', fontSize: '12px' }}>By {post.author}</span>
                    <button className="text-btn" style={{ fontSize: '12px' }}>READ MORE →</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
